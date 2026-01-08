import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FriendsService {
    constructor(private prisma: PrismaService) { }

    // Send a friend request
    async sendFriendRequest(senderId: number, receiverId: number) {
        // Can't send request to yourself
        if (senderId === receiverId) {
            throw new BadRequestException('Cannot send friend request to yourself');
        }

        // Check if receiver exists
        const receiver = await this.prisma.user.findUnique({
            where: { id: receiverId },
        });
        if (!receiver) {
            throw new NotFoundException('User not found');
        }

        // Check if already friends
        const existingFriendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: senderId, user2Id: receiverId },
                    { user1Id: receiverId, user2Id: senderId },
                ],
            },
        });
        if (existingFriendship) {
            throw new ConflictException('Already friends with this user');
        }

        // Check for existing request
        const existingRequest = await this.prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId, receiverId, status: 'PENDING' },
                    { senderId: receiverId, receiverId: senderId, status: 'PENDING' },
                ],
            },
        });
        if (existingRequest) {
            throw new ConflictException('Friend request already exists');
        }

        // Create friend request
        const request = await this.prisma.friendRequest.create({
            data: {
                senderId,
                receiverId,
                status: 'PENDING',
            },
            include: {
                sender: {
                    select: { id: true, name: true, email: true },
                },
                receiver: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return {
            id: request.id,
            senderId: request.sender.id,
            senderName: request.sender.name || request.sender.email,
            receiverId: request.receiver.id,
            receiverName: request.receiver.name || request.receiver.email,
            status: request.status,
            createdAt: request.createdAt,
        };
    }

    // Get pending friend requests (received by user)
    async getPendingRequests(userId: number) {
        console.log('[FriendsService] Getting pending requests for userId:', userId);
        const requests = await this.prisma.friendRequest.findMany({
            where: {
                receiverId: userId,
                status: 'PENDING',
            },
            include: {
                sender: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        console.log('[FriendsService] Found', requests.length, 'pending requests');
        return requests.map((req) => ({
            id: req.id,
            senderId: req.sender.id,
            senderName: req.sender.name || req.sender.email,
            senderEmail: req.sender.email,
            createdAt: req.createdAt,
        }));
    }

    // Get sent friend requests
    async getSentRequests(userId: number) {
        console.log('[FriendsService] Getting sent requests for userId:', userId);
        const requests = await this.prisma.friendRequest.findMany({
            where: {
                senderId: userId,
                status: 'PENDING',
            },
            include: {
                receiver: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        console.log('[FriendsService] Found', requests.length, 'sent requests');
        return requests.map((req) => ({
            id: req.id,
            receiverId: req.receiver.id,
            receiverName: req.receiver.name || req.receiver.email,
            receiverEmail: req.receiver.email,
            createdAt: req.createdAt,
        }));
    }

    // Accept friend request
    async acceptFriendRequest(userId: number, requestId: number) {
        const request = await this.prisma.friendRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            throw new NotFoundException('Friend request not found');
        }

        if (request.receiverId !== userId) {
            throw new ForbiddenException('You can only accept requests sent to you');
        }

        if (request.status !== 'PENDING') {
            throw new BadRequestException('Request has already been processed');
        }

        // Update request status and create friendship in a transaction
        await this.prisma.$transaction(async (tx) => {
            // Update request status
            await tx.friendRequest.update({
                where: { id: requestId },
                data: { status: 'ACCEPTED' },
            });

            // Create bidirectional friendship (always store with lower id as user1)
            const user1Id = Math.min(request.senderId, request.receiverId);
            const user2Id = Math.max(request.senderId, request.receiverId);

            await tx.friendship.create({
                data: {
                    user1Id,
                    user2Id,
                },
            });
        });

        return { message: 'Friend request accepted' };
    }

    // Reject friend request
    async rejectFriendRequest(userId: number, requestId: number) {
        const request = await this.prisma.friendRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            throw new NotFoundException('Friend request not found');
        }

        if (request.receiverId !== userId) {
            throw new ForbiddenException('You can only reject requests sent to you');
        }

        if (request.status !== 'PENDING') {
            throw new BadRequestException('Request has already been processed');
        }

        await this.prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: 'REJECTED' },
        });

        return { message: 'Friend request rejected' };
    }

    // Get friends list
    async getFriends(userId: number) {
        const friendships = await this.prisma.friendship.findMany({
            where: {
                OR: [{ user1Id: userId }, { user2Id: userId }],
            },
            include: {
                user1: {
                    select: { id: true, name: true, email: true },
                },
                user2: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return friendships.map((friendship) => {
            const friend =
                friendship.user1Id === userId ? friendship.user2 : friendship.user1;
            return {
                id: friend.id,
                name: friend.name || friend.email,
                email: friend.email,
                friendsSince: friendship.createdAt,
            };
        });
    }

    // Unfriend a user
    async unfriend(userId: number, friendId: number) {
        const friendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: friendId },
                    { user1Id: friendId, user2Id: userId },
                ],
            },
        });

        if (!friendship) {
            throw new NotFoundException('Friendship not found');
        }

        await this.prisma.friendship.delete({
            where: { id: friendship.id },
        });

        return { message: 'Unfriended successfully' };
    }

    // Search users by email
    async searchUsers(query: string, currentUserId: number) {
        const users = await this.prisma.user.findMany({
            where: {
                OR: [
                    { email: { contains: query, mode: 'insensitive' } },
                    { name: { contains: query, mode: 'insensitive' } },
                ],
                NOT: { id: currentUserId }, // Exclude current user
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
            take: 10,
        });

        // Check friendship status for each user
        const usersWithStatus = await Promise.all(
            users.map(async (user) => {
                // Check if already friends
                const friendship = await this.prisma.friendship.findFirst({
                    where: {
                        OR: [
                            { user1Id: currentUserId, user2Id: user.id },
                            { user1Id: user.id, user2Id: currentUserId },
                        ],
                    },
                });

                if (friendship) {
                    return { ...user, status: 'friends' };
                }

                // Check for pending request
                const pendingRequest = await this.prisma.friendRequest.findFirst({
                    where: {
                        OR: [
                            { senderId: currentUserId, receiverId: user.id, status: 'PENDING' },
                            { senderId: user.id, receiverId: currentUserId, status: 'PENDING' },
                        ],
                    },
                });

                if (pendingRequest) {
                    if (pendingRequest.senderId === currentUserId) {
                        return { ...user, status: 'request_sent' };
                    } else {
                        return { ...user, status: 'request_received' };
                    }
                }

                return { ...user, status: 'none' };
            })
        );

        return usersWithStatus;
    }

    // Check if two users are friends
    async areFriends(user1Id: number, user2Id: number): Promise<boolean> {
        const friendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: user1Id, user2Id: user2Id },
                    { user1Id: user2Id, user2Id: user1Id },
                ],
            },
        });

        return !!friendship;
    }

    // Get friend IDs for a user
    async getFriendIds(userId: number): Promise<number[]> {
        const friendships = await this.prisma.friendship.findMany({
            where: {
                OR: [{ user1Id: userId }, { user2Id: userId }],
            },
        });

        return friendships.map((friendship) =>
            friendship.user1Id === userId ? friendship.user2Id : friendship.user1Id
        );
    }
}
