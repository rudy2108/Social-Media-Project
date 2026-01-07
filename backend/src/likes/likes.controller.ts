import {
    Controller,
    Post,
    Get,
    Param,
    ParseIntPipe,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LikesService } from './likes.service';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class LikesController {
    constructor(private likesService: LikesService) { }

    @Post(':postId/like')
    async toggleLike(
        @Param('postId', ParseIntPipe) postId: number,
        @Request() req,
    ) {
        return this.likesService.toggleLike(req.user.userId, postId);
    }

    @Get(':postId/likes')
    async getPostLikes(
        @Param('postId', ParseIntPipe) postId: number,
        @Request() req,
    ) {
        return this.likesService.getPostLikes(postId, req.user.userId);
    }
}
