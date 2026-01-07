import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createPostDto: CreatePostDto, file?: Express.Multer.File): Promise<{
        user: {
            id: number;
            email: string;
            name: string | null;
        };
    } & {
        id: number;
        title: string;
        description: string;
        imageUrl: string | null;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(startDate?: string, endDate?: string): Promise<({
        user: {
            id: number;
            email: string;
            name: string | null;
        };
    } & {
        id: number;
        title: string;
        description: string;
        imageUrl: string | null;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findUserPosts(userId: number): Promise<({
        user: {
            id: number;
            email: string;
            name: string | null;
        };
    } & {
        id: number;
        title: string;
        description: string;
        imageUrl: string | null;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        user: {
            id: number;
            email: string;
            name: string | null;
        };
    } & {
        id: number;
        title: string;
        description: string;
        imageUrl: string | null;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, userId: number, userRole: string, updatePostDto: UpdatePostDto): Promise<{
        user: {
            id: number;
            email: string;
            name: string | null;
        };
    } & {
        id: number;
        title: string;
        description: string;
        imageUrl: string | null;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number, userId: number, userRole: string): Promise<{
        message: string;
    }>;
}
