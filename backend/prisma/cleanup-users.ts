import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Cleaning up database...');

    // Delete all comments, likes, and posts from non-admin users first (due to foreign key constraints)
    console.log('📝 Deleting comments...');
    await prisma.comment.deleteMany({
        where: {
            user: {
                role: 'USER'
            }
        }
    });

    console.log('❤️ Deleting likes...');
    await prisma.like.deleteMany({
        where: {
            user: {
                role: 'USER'
            }
        }
    });

    console.log('📄 Deleting posts...');
    await prisma.post.deleteMany({
        where: {
            user: {
                role: 'USER'
            }
        }
    });

    // Now delete all users except admin
    console.log('👥 Deleting non-admin users...');
    const result = await prisma.user.deleteMany({
        where: {
            role: 'USER'
        }
    });

    console.log(`✅ Cleanup complete! Deleted ${result.count} regular users.`);
    console.log('🔑 Admin user (admin@test.com) has been preserved.');

    // Show remaining users
    const remainingUsers = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true
        }
    });

    console.log('\n📊 Remaining users:');
    remainingUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });
}

main()
    .catch((e) => {
        console.error('❌ Error during cleanup:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
