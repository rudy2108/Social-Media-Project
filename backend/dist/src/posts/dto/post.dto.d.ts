import * as yup from 'yup';
export declare const createPostSchema: yup.ObjectSchema<{
    title: string;
    description: string;
}, yup.AnyObject, {
    title: undefined;
    description: undefined;
}, "">;
export declare class CreatePostDto {
    title: string;
    description: string;
    imageUrl?: string;
}
export declare class UpdatePostDto {
    title?: string;
    description?: string;
    imageUrl?: string;
}
