import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🗑️  Starting user deletion...');

    // First, delete all related data for non-admin users
    console.log('📝 Deleting related data...');

    // Delete comments, likes, posts, friend requests, and friendships for non-admin users
    const nonAdminUsers = await prisma.user.findMany({
        where: {
            email: {
                not: 'admin@test.com'
            }
        },
        select: { id: true, email: true }
    });

    console.log(`Found ${nonAdminUsers.length} non-admin users to delete:`);
    nonAdminUsers.forEach(u => console.log(`  - ${u.email} (ID: ${u.id})`));

    // Delete all comments by non-admin users
    await prisma.comment.deleteMany({
        where: {
            userId: {
                in: nonAdminUsers.map(u => u.id)
            }
        }
    });

    // Delete all likes by non-admin users
    await prisma.like.deleteMany({
        where: {
            userId: {
                in: nonAdminUsers.map(u => u.id)
            }
        }
    });

    // Delete all posts by non-admin users
    await prisma.post.deleteMany({
        where: {
            userId: {
                in: nonAdminUsers.map(u => u.id)
            }
        }
    });

    // Delete all friend requests involving non-admin users
    await prisma.friendRequest.deleteMany({
        where: {
            OR: [
                {
                    senderId: {
                        in: nonAdminUsers.map(u => u.id)
                    }
                },
                {
                    receiverId: {
                        in: nonAdminUsers.map(u => u.id)
                    }
                }
            ]
        }
    });

    // Delete all friendships involving non-admin users
    await prisma.friendship.deleteMany({
        where: {
            OR: [
                {
                    user1Id: {
                        in: nonAdminUsers.map(u => u.id)
                    }
                },
                {
                    user2Id: {
                        in: nonAdminUsers.map(u => u.id)
                    }
                }
            ]
        }
    });

    // Now delete the non-admin users
    const deletedUsers = await prisma.user.deleteMany({
        where: {
            email: {
                not: 'admin@test.com'
            }
        }
    });

    console.log(`\n✅ Successfully deleted ${deletedUsers.count} non-admin users!`);

    // Show remaining users
    const remainingUsers = await prisma.user.findMany();
    console.log(`\n📊 Remaining users (${remainingUsers.length}):`);
    remainingUsers.forEach(u => console.log(`  - ${u.email} (${u.role})`));
}

main()
    .catch((e) => {
        console.error('❌ Error deleting users:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
