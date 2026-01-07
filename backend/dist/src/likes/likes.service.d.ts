import { PrismaService } from '../prisma/prisma.service';
export declare class LikesService {
    private prisma;
    constructor(prisma: PrismaService);
    toggleLike(userId: number, postId: number): Promise<{
        liked: boolean;
        message: string;
    }>;
    getPostLikes(postId: number, currentUserId?: number): Promise<{
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
