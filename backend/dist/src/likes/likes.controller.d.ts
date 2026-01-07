import { LikesService } from './likes.service';
export declare class LikesController {
    private likesService;
    constructor(likesService: LikesService);
    toggleLike(postId: number, req: any): Promise<{
        liked: boolean;
        message: string;
    }>;
    getPostLikes(postId: number, req: any): Promise<{
        likesCount: number;
        isLikedByUser: boolean;
        likes: {
            id: number;
            userId: number;
            userName: string;
            createdAt: Date;
        }[];
    }>;
}
