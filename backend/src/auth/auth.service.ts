import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async comparePasswords(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async validateUser(email: string, password: string): Promise<any> {
        console.log(`🔐 Login attempt for email: "${email}"`);
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log(`❌ User not found: ${email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        console.log(`✅ User found: ${user.email} (ID: ${user.id}, Role: ${user.role}, Status: ${user.status})`);

        // Check if user is BANNED
        if (user.status === 'BANNED') {
            console.log(`🚫 User is BANNED: ${email}`);
            throw new UnauthorizedException('Your ID got banned. Please contact the administrator.');
        }

        // Check if user is SUSPENDED
        if (user.status === 'SUSPENDED') {
            if (user.suspendedUntil && new Date() < user.suspendedUntil) {
                // Still within suspension period
                const remainingHours = Math.ceil((user.suspendedUntil.getTime() - Date.now()) / (1000 * 60 * 60));
                console.log(`⏸️ User is SUSPENDED until ${user.suspendedUntil}. Remaining: ${remainingHours} hours`);
                throw new UnauthorizedException(
                    `Your ID got suspended for 24 hours. Please try to login after 24 hours.`
                );
            } else {
                // Suspension period has expired, auto-release the user
                console.log(`✅ Suspension expired for user: ${email}. Auto-releasing...`);
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        status: 'ACTIVE',
                        suspendedUntil: null,
                    },
                });
                user.status = 'ACTIVE';
                user.suspendedUntil = null;
            }
        }

        const isPasswordValid = await this.comparePasswords(password, user.password);

        if (!isPasswordValid) {
            console.log(`❌ Password validation failed for user: ${email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        console.log(`✅ Password validation successful for user: ${email}`);

        // Update lastLoginAt timestamp
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        const { password: _, ...result } = user;
        return result;
    }

    async register(registerDto: RegisterDto) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await this.hashPassword(registerDto.password);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                name: registerDto.name,
                address: registerDto.address,
                age: registerDto.age,
                role: 'USER', // Default role
            },
        });

        // Generate JWT token
        const payload = { email: user.email, sub: user.id, role: user.role };

        const { password: _, ...userWithoutPassword } = user;

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: userWithoutPassword.id,
                email: userWithoutPassword.email,
                name: userWithoutPassword.name,
                role: userWithoutPassword.role,
            },
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        const payload = { email: user.email, sub: user.id, role: user.role };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    async adminLogin(loginDto: LoginDto) {
        const result = await this.login(loginDto);

        if (result.user.role !== 'ADMIN') {
            throw new UnauthorizedException('Admin access required');
        }

        return result;
    }
}
