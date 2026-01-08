import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard, UserGuard } from '../auth/guards/roles.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    findAll(@Query('status') status?: string) {
        return this.usersService.findAll(status as any);
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'), UserGuard)
    getProfile(@Request() req) {
        return this.usersService.findOne(req.user.userId);
    }

    @Patch('profile')
    @UseGuards(AuthGuard('jwt'), UserGuard)
    updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(req.user.userId, updateUserDto);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'), UserGuard)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), UserGuard)
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }

    @Patch(':id/status')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' },
        @Request() req
    ) {
        // Prevent admin from modifying their own status
        if (id === req.user.userId) {
            throw new BadRequestException('Cannot modify your own status');
        }
        return this.usersService.updateStatus(id, body.status);
    }
}
