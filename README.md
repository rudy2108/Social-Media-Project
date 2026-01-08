# Social Media Platform - Setup Guide

This is a high-end social media platform built with NestJS, Prisma, Next.js, and Redux.

## Features

### Backend (NestJS + Prisma + SQLite)
- ✅ JWT Authentication with bcrypt password hashing
- ✅ Role-based access control (Admin/User)
- ✅ User CRUD operations with YUP validation
- ✅ Post management with date filtering
- ✅ **Photo Uploads** for posts (Multer + Static serving)
- ✅ **Social Interactions**: Like and Comment on posts
- ✅ RESTful API with CORS enabled

### Frontend (Next.js + Redux)
- ✅ Premium glassmorphism UI design
- ✅ Redux Toolkit for state management
- ✅ Axios API integration with interceptors
- ✅ Admin dashboard with user/post management
- ✅ User dashboard with:
    - **Personalized Feed**: Recent posts from all users
    - **Navigation**: Dedicated "Posts", "Create Post", and "Profile" sections
    - **Social Features**: Like buttons and Comment sections on posts
- ✅ Responsive design with modern animations

## Quick Start

### Backend Setup

```bash
cd backend

# Install dependencies (if not already done)
npm install

# Initialize database manually
npx ts-node -r tsconfig-paths/register prisma/migrations/init.sql

# Run the backend
npm run start:dev
```

Backend will run on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend

# Run the frontend
npm run dev
```

Frontend will run on `http://localhost:3001`

## Demo Credentials

### Admin Account
- Email: `admin@test.com`
- Password: `password123`

### User Account
- Email: `user@test.com`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/user/login` - User login
- `POST /api/auth/logout` - Logout

### Users (Protected)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get current user profile
- `PATCH /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (Admin only)

### Posts (Protected)
- `POST /api/posts` - Create new post (supports file upload)
- `GET /api/posts/my-posts` - Get user's own posts
- `GET /api/posts?startDate=&endDate=` - Get all posts with date filter (Admin only)
- `DELETE /api/posts/:id` - Delete post

### Social (Protected)
- `POST /api/likes` - Like a post
- `DELETE /api/likes/:id` - Unlike a post
- `POST /api/comments` - Add a comment
- `DELETE /api/comments/:id` - Delete a comment

## Project Structure

```
backend/
├── src/
│   ├── auth/          # Authentication module with JWT
│   ├── users/         # User management
│   ├── posts/         # Post management (incl. uploads)
│   ├── likes/         # Like management
│   ├── comments/      # Comment management
│   ├── prisma/        # Database service
│   └── main.ts        # App entry point
└── prisma/
    └── schema.prisma  # Database schema

frontend/
├── src/
│   ├── app/          # Next.js pages
│   │   ├── login/           # Login page
│   │   ├── dashboard/       # User dashboard (Feed, Create, Profile)
│   │   └── admin/dashboard/ # Admin dashboard
│   ├── store/               # Redux store
│   └── services/            # API service
└── globals.css       # Premium design system
```

## Notes

**Important**: Due to Prisma CLI configuration issues, you may need to manually set up the database. The schema is defined in `backend/prisma/schema.prisma`.

Alternative database setup:
1. Install SQLite
2. Create a database file at `backend/prisma/dev.db`
3. Run the migration SQL from `backend/prisma/migrations/init.sql`
4. Optionally run the seed script to create demo users

## Technology Stack

- **Backend**: NestJS, Prisma ORM, SQLite, JWT, bcrypt, YUP validation
- **Frontend**: Next.js 14, React, TypeScript, Redux Toolkit, Axios
- **UI**: Custom CSS with glassmorphism, gradients, animations
- **Fonts**: Google Fonts (Inter)

## Features Highlights

✨ **Premium Design**: Glassmorphism effects, smooth animations, gradient backgrounds
🔐 **Secure Auth**: JWT tokens, bcrypt password hashing, role-based access
📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile
🎨 **Modern UI**: Floating labels, hover effects, micro-animations
⚡ **Fast**: Optimized Redux state management and API calls
