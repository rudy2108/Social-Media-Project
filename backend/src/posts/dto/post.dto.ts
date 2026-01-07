import * as yup from 'yup';

export const createPostSchema = yup.object().shape({
    title: yup.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must not exceed 200 characters').required('Title is required'),
    description: yup.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must not exceed 5000 characters').required('Description is required'),
});

export class CreatePostDto {
    title: string;
    description: string;
    imageUrl?: string;
}

export class UpdatePostDto {
    title?: string;
    description?: string;
    imageUrl?: string;
}
