import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Hash passwords
    const adminPassword = await bcrypt.hash('password123', 10);
    const userPassword = await bcrypt.hash('password123', 10);

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            email: 'admin@test.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN',
            age: 30,
            address: '123 Admin Street',
        },
    });

    // Create regular user
    const user = await prisma.user.upsert({
        where: { email: 'user@test.com' },
        update: {},
        create: {
            email: 'user@test.com',
            password: userPassword,
            name: 'Test User',
            role: 'USER',
            age: 25,
            address: '456 User Avenue',
        },
    });

    // Create some sample posts
    await prisma.post.createMany({
        data: [
            {
                title: 'Welcome to the Platform',
                description: 'This is a sample post to demonstrate the platform features.',
                userId: user.id,
            },
            {
                title: 'Getting Started Guide',
                description: 'Learn how to navigate and use all the features of this social media platform.',
                userId: user.id,
            },
            {
                title: 'Admin Announcement',
                description: 'Important updates and announcements from the admin team.',
                userId: admin.id,
            },
        ],
    });

    console.log('Database seeded successfully!');
    console.log('Admin:', admin);
    console.log('User:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
