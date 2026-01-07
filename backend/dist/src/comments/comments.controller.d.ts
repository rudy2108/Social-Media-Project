import { CommentsService } from './comments.service';
import { CreateCommentDto } from './comments.dto';
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    createComment(postId: number, createCommentDto: CreateCommentDto, req: any): Promise<{
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
    deleteComment(commentId: number, req: any): Promise<{
        message: string;
    }>;
}
