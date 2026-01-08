import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('password123', 10);
    const userPassword = await bcrypt.hash('password123', 10);

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            email: 'admin@test.com',
            password: adminPassword,
            name: 'Admin User',
            role: Role.ADMIN,
            age: 30,
            address: '123 Admin Street, Admin City',
        },
    });

    // Create regular users
    console.log('👥 Creating regular users...');
    const user1 = await prisma.user.upsert({
        where: { email: 'user@test.com' },
        update: {},
        create: {
            email: 'user@test.com',
            password: userPassword,
            name: 'John Doe',
            role: Role.USER,
            age: 25,
            address: '456 User Avenue, User City',
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'alice@test.com' },
        update: {},
        create: {
            email: 'alice@test.com',
            password: userPassword,
            name: 'Alice Smith',
            role: Role.USER,
            age: 28,
            address: '789 Alice Lane, Tech City',
        },
    });

    const user3 = await prisma.user.upsert({
        where: { email: 'bob@test.com' },
        update: {},
        create: {
            email: 'bob@test.com',
            password: userPassword,
            name: 'Bob Johnson',
            role: Role.USER,
            age: 32,
            address: '321 Bob Boulevard, Code Town',
        },
    });

    const user4 = await prisma.user.upsert({
        where: { email: 'sara@test.com' },
        update: {},
        create: {
            email: 'sara@test.com',
            password: userPassword,
            name: 'Sara Williams',
            role: Role.USER,
            age: 24,
            address: '654 Sara Street, Dev City',
        },
    });

    // Delete existing posts (to avoid duplicates)
    await prisma.comment.deleteMany();
    await prisma.like.deleteMany();
    await prisma.post.deleteMany({
        where: {
            userId: {
                in: [admin.id, user1.id, user2.id, user3.id, user4.id],
            },
        },
    });

    // Create sample posts
    console.log('📝 Creating posts...');
    const post1 = await prisma.post.create({
        data: {
            title: 'Welcome to our Social Media Platform!',
            description: 'This is my first post on this amazing platform. Excited to connect with everyone!',
            userId: user1.id,
        },
    });

    const post2 = await prisma.post.create({
        data: {
            title: 'Beautiful Sunset Today',
            description: 'Just captured an amazing sunset at the beach. Nature is just breathtaking! 🌅',
            userId: user2.id,
        },
    });

    const post3 = await prisma.post.create({
        data: {
            title: 'Coding Journey Update',
            description: 'Finally completed my full-stack project! It took 3 months but the learning experience was incredible. 💻',
            userId: user3.id,
        },
    });

    const post4 = await prisma.post.create({
        data: {
            title: 'Coffee and Code',
            description: 'There is nothing better than a good cup of coffee while working on a challenging bug. ☕',
            userId: user1.id,
        },
    });

    const post5 = await prisma.post.create({
        data: {
            title: 'Weekend Adventure',
            description: 'Just got back from an amazing hiking trip! The views from the summit were absolutely worth the climb. 🏔️',
            userId: user4.id,
        },
    });

    const post6 = await prisma.post.create({
        data: {
            title: 'Tech Conference Highlights',
            description: 'Attended an amazing tech conference today. So many inspiring talks about AI and web development!',
            userId: user2.id,
        },
    });

    // Create likes
    console.log('❤️ Creating likes...');
    await prisma.like.createMany({
        data: [
            { userId: user1.id, postId: post2.id },
            { userId: user1.id, postId: post3.id },
            { userId: user2.id, postId: post1.id },
            { userId: user2.id, postId: post3.id },
            { userId: user2.id, postId: post5.id },
            { userId: user3.id, postId: post1.id },
            { userId: user3.id, postId: post2.id },
            { userId: user3.id, postId: post5.id },
            { userId: user4.id, postId: post1.id },
            { userId: user4.id, postId: post2.id },
            { userId: user4.id, postId: post3.id },
            { userId: user4.id, postId: post4.id },
        ],
    });

    // Create comments
    console.log('💬 Creating comments...');
    await prisma.comment.createMany({
        data: [
            {
                text: 'Welcome! Happy to have you here! 🎉',
                userId: user2.id,
                postId: post1.id,
            },
            {
                text: 'Great to see you join the community!',
                userId: user3.id,
                postId: post1.id,
            },
            {
                text: 'Wow! That sunset is absolutely gorgeous! 😍',
                userId: user1.id,
                postId: post2.id,
            },
            {
                text: 'Congratulations! That\'s a huge achievement! 🎊',
                userId: user2.id,
                postId: post3.id,
            },
            {
                text: 'Would love to hear more about your tech stack!',
                userId: user4.id,
                postId: post3.id,
            },
            {
                text: 'Coffee is definitely a developer\'s best friend! ☕💻',
                userId: user2.id,
                postId: post4.id,
            },
            {
                text: 'Those views look incredible! 🏔️✨',
                userId: user3.id,
                postId: post5.id,
            },
            {
                text: 'Which conference? Would love to check it out!',
                userId: user1.id,
                postId: post6.id,
            },
        ],
    });

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Created 1 admin user');
    console.log('   - Created 4 regular users');
    console.log('   - Created 6 posts');
    console.log('   - Created 12 likes');
    console.log('   - Created 8 comments');
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin@test.com / password123');
    console.log('   User 1: user@test.com / password123');
    console.log('   User 2: alice@test.com / password123');
    console.log('   User 3: bob@test.com / password123');
    console.log('   User 4: sara@test.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

