export declare class CreateCommentDto {
    text: string;
}
export declare class CommentResponseDto {
    id: number;
    text: string;
    userId: number;
    userName: string;
    postId: number;
    createdAt: Date;
    updatedAt: Date;
}
