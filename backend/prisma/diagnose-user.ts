import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function diagnoseUser() {
    console.log('🔍 Detailed diagnosis for user1@gmail.com\n');

    const user = await prisma.user.findUnique({
        where: { email: 'user1@gmail.com' },
    });

    if (!user) {
        console.log('❌ User not found!');
        return;
    }

    console.log('👤 User Details:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: "${user.email}"`);
    console.log(`   Email Length: ${user.email.length}`);
    console.log(`   Email (bytes): ${Buffer.from(user.email).toString('hex')}`);
    console.log(`   Name: "${user.name}"`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.status}`);
    console.log(`   Password Hash Length: ${user.password.length}`);
    console.log(`   Password Hash: ${user.password}`);
    console.log();

    // Test multiple password variations
    console.log('🔐 Testing Password Variations:');
    const passwordTests = [
        '123456',
        ' 123456',
        '123456 ',
        ' 123456 ',
        '123456\n',
        '123456\r',
        '123456\r\n',
    ];

    for (const pwd of passwordTests) {
        const displayPwd = pwd.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/ /g, '·');
        const match = await bcrypt.compare(pwd, user.password);
        console.log(`   "${displayPwd}" → ${match ? '✅ MATCH' : '❌ No match'}`);
    }

    console.log();
    console.log('📧 Checking for email variations:');

    // Search for similar emails
    const allUsers = await prisma.user.findMany({
        where: {
            email: {
                contains: 'user1',
            }
        },
        select: {
            id: true,
            email: true,
            name: true,
        }
    });

    console.log(`   Found ${allUsers.length} user(s) with 'user1' in email:`);
    allUsers.forEach(u => {
        console.log(`   - ID ${u.id}: "${u.email}" (${u.email.length} chars) - ${u.name}`);
    });
}

diagnoseUser()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
