import * as yup from 'yup';
export declare const createUserSchema: yup.ObjectSchema<{
    email: string;
    password: string;
    name: string | undefined;
    address: string | undefined;
    age: number | undefined;
    role: "ADMIN" | "USER" | undefined;
}, yup.AnyObject, {
    email: undefined;
    password: undefined;
    name: undefined;
    address: undefined;
    age: undefined;
    role: undefined;
}, "">;
export declare const updateUserSchema: yup.ObjectSchema<{
    name: string | undefined;
    address: string | undefined;
    age: number | undefined;
}, yup.AnyObject, {
    name: undefined;
    address: undefined;
    age: undefined;
}, "">;
export declare class CreateUserDto {
    email: string;
    password: string;
    name?: string;
    address?: string;
    age?: number;
    role?: 'ADMIN' | 'USER';
}
export declare class UpdateUserDto {
    name?: string;
    address?: string;
    age?: number;
}
