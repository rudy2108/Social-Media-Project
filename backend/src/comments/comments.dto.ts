import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    text: string;
}

export class CommentResponseDto {
    id: number;
    text: string;
    userId: number;
    userName: string;
    postId: number;
    createdAt: Date;
    updatedAt: Date;
}
