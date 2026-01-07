import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard, AdminGuard } from '../auth/guards/roles.guard';
import { multerConfig } from '../config/multer.config';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), UserGuard)
    @UseInterceptors(FileInterceptor('image', multerConfig))
    create(@Request() req, @Body() createPostDto: CreatePostDto, @UploadedFile() file?: Express.Multer.File) {
        return this.postsService.create(req.user.userId, createPostDto, file);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    findAll(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        return this.postsService.findAll(startDate, endDate);
    }

    @Get('my-posts')
    @UseGuards(AuthGuard('jwt'), UserGuard)
    findMyPosts(@Request() req) {
        return this.postsService.findUserPosts(req.user.userId);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'), UserGuard)
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), UserGuard)
    update(@Param('id') id: string, @Request() req, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(+id, req.user.userId, req.user.role, updatePostDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), UserGuard)
    remove(@Param('id') id: string, @Request() req) {
        return this.postsService.remove(+id, req.user.userId, req.user.role);
    }
}
