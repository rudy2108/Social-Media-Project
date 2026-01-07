export declare class ToggleLikeDto {
    postId: number;
}
export declare class LikeResponseDto {
    likesCount: number;
    isLikedByUser: boolean;
    likes: {
        id: number;
        userId: number;
        userName: string;
        createdAt: Date;
    }[];
}
