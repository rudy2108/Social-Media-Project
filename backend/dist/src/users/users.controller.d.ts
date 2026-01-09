import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        email: string;
        name: string | null;
        address: string | null;
        age: number | null;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.UserStatus;
        suspendedUntil: Date | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(status?: string): Promise<{
        email: string;
        name: string | null;
        address: string | null;
        age: number | null;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.UserStatus;
        suspendedUntil: Date | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    getProfile(req: any): Promise<{
        email: string;
        name: string | null;
        address: string | null;
        age: number | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        name: string | null;
        address: string | null;
        age: number | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findOne(id: string): Promise<{
        email: string;
        name: string | null;
        address: string | null;
        age: number | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        name: string | null;
        address: string | null;
        age: number | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateStatus(id: number, body: {
        status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
    }, req: any): Promise<{
        email: string;
        name: string | null;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.UserStatus;
        suspendedUntil: Date | null;
        id: number;
    }>;
}
