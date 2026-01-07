import { Request } from 'express';
export declare const multerConfig: {
    storage: import("multer").StorageEngine;
    fileFilter: (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => void;
    limits: {
        fileSize: number;
    };
};
