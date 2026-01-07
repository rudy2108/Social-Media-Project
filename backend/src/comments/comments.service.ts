import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './comments.dto';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async createComment(
        userId: number,
        postId: number,
        createCommentDto: CreateCommentDto,
    ) {
        // Check if post exists
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const comment = await this.prisma.comment.create({
            data: {
                text: createCommentDto.text,
                userId,
                postId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return {
            id: comment.id,
            text: comment.text,
            userId: comment.user.id,
            userName: comment.user.name || comment.user.email,
            postId: comment.postId,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        };
    }

    async getPostComments(postId: number) {
        // Check if post exists
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const comments = await this.prisma.comment.findMany({
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

        return comments.map((comment) => ({
            id: comment.id,
            text: comment.text,
            userId: comment.user.id,
            userName: comment.user.name || comment.user.email,
            postId: comment.postId,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        }));
    }

    async deleteComment(userId: number, commentId: number) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        // Only the comment author can delete it
        if (comment.userId !== userId) {
            throw new ForbiddenException(
                'You can only delete your own comments',
            );
        }

        await this.prisma.comment.delete({
            where: { id: commentId },
        });

        return { message: 'Comment deleted successfully' };
    }
}
