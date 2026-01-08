import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            status: true,
        }
    });

    console.log('📊 Users in database:\n');
    users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.name}`);
        console.log(`Role: ${user.role}`);
        console.log(`Status: ${user.status}`);
        console.log('---');
    });
    console.log(`\nTotal users: ${users.length}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
