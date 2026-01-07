import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, createUserSchema, updateUserSchema } from './dto/user.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private authService: AuthService,
    ) { }

    async create(createUserDto: CreateUserDto) {
        // Validate with YUP
        try {
            await createUserSchema.validate(createUserDto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }

        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await this.authService.hashPassword(createUserDto.password);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });

        const { password, ...result } = user;
        return result;
    }

    async findAll() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                address: true,
                age: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return users;
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                address: true,
                age: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        // Validate with YUP
        try {
            await updateUserSchema.validate(updateUserDto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }

        // Check if user exists
        await this.findOne(id);

        // Update user
        const user = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            select: {
                id: true,
                email: true,
                name: true,
                address: true,
                age: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }

    async remove(id: number) {
        // Check if user exists
        await this.findOne(id);

        await this.prisma.user.delete({
            where: { id },
        });

        return { message: `User with ID ${id} has been deleted` };
    }
}
