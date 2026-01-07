import { IsInt } from 'class-validator';

export class ToggleLikeDto {
    @IsInt()
    postId: number;
}

export class LikeResponseDto {
    likesCount: number;
    isLikedByUser: boolean;
    likes: {
        id: number;
        userId: number;
        userName: string;
        createdAt: Date;
    }[];
}
