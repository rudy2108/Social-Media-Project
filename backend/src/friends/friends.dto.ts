import { IsInt, IsNotEmpty } from 'class-validator';

export class SendFriendRequestDto {
    @IsInt()
    @IsNotEmpty()
    receiverId: number;
}

export class AcceptFriendRequestDto {
    @IsInt()
    @IsNotEmpty()
    requestId: number;
}

export class RejectFriendRequestDto {
    @IsInt()
    @IsNotEmpty()
    requestId: number;
}
