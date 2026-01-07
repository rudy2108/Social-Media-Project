import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(req: any, createPostDto: CreatePostDto, file?: Express.Multer.File): Promise<{
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
    findMyPosts(req: any): Promise<({
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
    findOne(id: string): Promise<{
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
    update(id: string, req: any, updatePostDto: UpdatePostDto): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
