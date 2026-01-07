import * as yup from 'yup';

export const createUserSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    name: yup.string().optional(),
    address: yup.string().optional(),
    age: yup.number().positive('Age must be a positive number').integer('Age must be an integer').optional(),
    role: yup.string().oneOf(['ADMIN', 'USER'], 'Role must be either ADMIN or USER').optional(),
});

export const updateUserSchema = yup.object().shape({
    name: yup.string().optional(),
    address: yup.string().optional(),
    age: yup.number().positive('Age must be a positive number').integer('Age must be an integer').optional(),
});

export class CreateUserDto {
    email: string;
    password: string;
    name?: string;
    address?: string;
    age?: number;
    role?: 'ADMIN' | 'USER';
}

export class UpdateUserDto {
    name?: string;
    address?: string;
    age?: number;
}
