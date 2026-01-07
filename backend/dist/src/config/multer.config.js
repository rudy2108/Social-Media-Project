"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
exports.multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads/posts',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = (0, path_1.extname)(file.originalname);
            callback(null, `post-${uniqueSuffix}${ext}`);
        },
    }),
    fileFilter: (req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return callback(new common_1.BadRequestException('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
        }
        callback(null, true);
    },
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
};
//# sourceMappingURL=multer.config.js.map