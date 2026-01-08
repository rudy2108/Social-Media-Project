import { IsEmail, IsString, MinLength, IsOptional, IsInt, Min, Max } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    name: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsInt()
    @Min(13, { message: 'Age must be at least 13' })
    @Max(120, { message: 'Age must be less than 120' })
    age?: number;
}
