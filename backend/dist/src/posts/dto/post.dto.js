"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePostDto = exports.CreatePostDto = exports.createPostSchema = void 0;
const yup = __importStar(require("yup"));
exports.createPostSchema = yup.object().shape({
    title: yup.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must not exceed 200 characters').required('Title is required'),
    description: yup.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must not exceed 5000 characters').required('Description is required'),
});
class CreatePostDto {
    title;
    description;
    imageUrl;
}
exports.CreatePostDto = CreatePostDto;
class UpdatePostDto {
    title;
    description;
    imageUrl;
}
exports.UpdatePostDto = UpdatePostDto;
//# sourceMappingURL=post.dto.js.map