import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, createPostSchema } from './dto/post.dto';
import { FriendsService } from '../friends/friends.service';

@Injectable()
export class PostsService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => FriendsService))
        private friendsService: FriendsService,
    ) { }

    async create(userId: number, createPostDto: CreatePostDto, file?: Express.Multer.File) {
        // Validate with YUP
        try {
            await createPostSchema.validate(createPostDto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }

        // If file is uploaded, add the image URL to the DTO
        if (file) {
            createPostDto.imageUrl = `/uploads/posts/${file.filename}`;
        }

        const post = await this.prisma.post.create({
            data: {
                ...createPostDto,
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });

        return post;
    }

    async findAll(startDate?: string, endDate?: string) {
        const where: any = {};

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }

        const posts = await this.prisma.post.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return posts;
    }

    async findUserPosts(userId: number) {
        const posts = await this.prisma.post.findMany({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return posts;
    }

    async getFriendsPosts(userId: number) {
        // Get friend IDs
        const friendIds = await this.friendsService.getFriendIds(userId);

        // Also include user's own posts
        const userIdsToInclude = [...friendIds, userId];

        const posts = await this.prisma.post.findMany({
            where: {
                userId: {
                    in: userIdsToInclude,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return posts;
    }

    async findOne(id: number) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        return post;
    }

    async update(id: number, userId: number, userRole: string, updatePostDto: UpdatePostDto) {
        const post = await this.findOne(id);

        // Check if user owns the post or is admin
        if (post.userId !== userId && userRole !== 'ADMIN') {
            throw new ForbiddenException('You do not have permission to update this post');
        }

        const updatedPost = await this.prisma.post.update({
            where: { id },
            data: updatePostDto,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });

        return updatedPost;
    }

    async remove(id: number, userId: number, userRole: string) {
        const post = await this.findOne(id);

        // Check if user owns the post or is admin
        if (post.userId !== userId && userRole !== 'ADMIN') {
            throw new ForbiddenException('You do not have permission to delete this post');
        }

        await this.prisma.post.delete({
            where: { id },
        });

        return { message: `Post with ID ${id} has been deleted` };
    }
}
