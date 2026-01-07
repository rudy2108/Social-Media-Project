import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
    constructor(private prisma: PrismaService) { }

    async toggleLike(userId: number, postId: number) {
        // Check if post exists
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Check if user already liked the post
        const existingLike = await this.prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        if (existingLike) {
            // Unlike: remove the like
            await this.prisma.like.delete({
                where: { id: existingLike.id },
            });
            return { liked: false, message: 'Post unliked' };
        } else {
            // Like: create a new like
            await this.prisma.like.create({
                data: {
                    userId,
                    postId,
                },
            });
            return { liked: true, message: 'Post liked' };
        }
    }

    async getPostLikes(postId: number, currentUserId?: number) {
        // Check if post exists
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Get all likes for the post
        const likes = await this.prisma.like.findMany({
            where: { postId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Check if current user has liked the post
        const isLikedByUser = currentUserId
            ? likes.some((like) => like.userId === currentUserId)
            : false;

        return {
            likesCount: likes.length,
            isLikedByUser,
            likes: likes.map((like) => ({
                id: like.id,
                userId: like.user.id,
                userName: like.user.name || like.user.email,
                createdAt: like.createdAt,
            })),
        };
    }
}
