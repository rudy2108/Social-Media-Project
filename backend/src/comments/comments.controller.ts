import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './comments.dto';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
    constructor(private commentsService: CommentsService) { }

    @Post('posts/:postId/comments')
    async createComment(
        @Param('postId', ParseIntPipe) postId: number,
        @Body() createCommentDto: CreateCommentDto,
        @Request() req,
    ) {
        return this.commentsService.createComment(
            req.user.userId,
            postId,
            createCommentDto,
        );
    }

    @Get('posts/:postId/comments')
    async getPostComments(@Param('postId', ParseIntPipe) postId: number) {
        return this.commentsService.getPostComments(postId);
    }

    @Delete('comments/:commentId')
    async deleteComment(
        @Param('commentId', ParseIntPipe) commentId: number,
        @Request() req,
    ) {
        return this.commentsService.deleteComment(req.user.userId, commentId);
    }
}
