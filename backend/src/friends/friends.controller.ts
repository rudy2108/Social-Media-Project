import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    UseGuards,
    Request,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendsService } from './friends.service';
import { SendFriendRequestDto } from './friends.dto';

@Controller('friends')
@UseGuards(AuthGuard('jwt'))
export class FriendsController {
    constructor(private friendsService: FriendsService) { }

    // Send friend request
    @Post('request/:userId')
    async sendRequest(
        @Request() req,
        @Param('userId', ParseIntPipe) receiverId: number,
    ) {
        return this.friendsService.sendFriendRequest(req.user.userId, receiverId);
    }

    // Get pending requests (received)
    @Get('requests/pending')
    async getPendingRequests(@Request() req) {
        return this.friendsService.getPendingRequests(req.user.userId);
    }

    // Get sent requests
    @Get('requests/sent')
    async getSentRequests(@Request() req) {
        return this.friendsService.getSentRequests(req.user.userId);
    }

    // Accept friend request
    @Post('requests/:requestId/accept')
    async acceptRequest(
        @Request() req,
        @Param('requestId', ParseIntPipe) requestId: number,
    ) {
        return this.friendsService.acceptFriendRequest(req.user.userId, requestId);
    }

    // Reject friend request
    @Post('requests/:requestId/reject')
    async rejectRequest(
        @Request() req,
        @Param('requestId', ParseIntPipe) requestId: number,
    ) {
        return this.friendsService.rejectFriendRequest(req.user.userId, requestId);
    }

    // Get friends list
    @Get()
    async getFriends(@Request() req) {
        return this.friendsService.getFriends(req.user.userId);
    }

    // Unfriend a user
    @Delete(':friendId')
    async unfriend(
        @Request() req,
        @Param('friendId', ParseIntPipe) friendId: number,
    ) {
        return this.friendsService.unfriend(req.user.userId, friendId);
    }

    // Search users
    @Get('search/users')
    async searchUsers(@Request() req, @Query('q') query: string) {
        if (!query || query.trim() === '') {
            return [];
        }
        return this.friendsService.searchUsers(query, req.user.userId);
    }
}
