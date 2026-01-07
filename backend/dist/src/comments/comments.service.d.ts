import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './comments.dto';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    createComment(userId: number, postId: number, createCommentDto: CreateCommentDto): Promise<{
        id: number;
        text: string;
        userId: number;
        userName: string;
        postId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPostComments(postId: number): Promise<{
        id: number;
        text: string;
        userId: number;
        userName: string;
        postId: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    deleteComment(userId: number, commentId: number): Promise<{
        message: string;
    }>;
}
