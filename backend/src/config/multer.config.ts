import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

// Allowed image file types
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
];

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const multerConfig = {
    storage: diskStorage({
        destination: './uploads/posts',
        filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = extname(file.originalname);
            callback(null, `post-${uniqueSuffix}${ext}`);
        },
    }),
    fileFilter: (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return callback(
                new BadRequestException('Only image files (JPEG, PNG, GIF, WebP) are allowed'),
                false
            );
        }
        callback(null, true);
    },
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
};
