import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Testing password authentication for user1@gmail.com\n');

    // Get the user from database
    const user = await prisma.user.findUnique({
        where: { email: 'user1@gmail.com' },
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
        }
    });

    if (!user) {
        console.log('❌ User not found!');
        return;
    }

    console.log('✅ User found:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Password Hash: ${user.password}`);
    console.log();

    // Test password comparison
    const testPassword = '123456';
    console.log(`🔐 Testing password: "${testPassword}"\n`);

    const isMatch = await bcrypt.compare(testPassword, user.password);

    if (isMatch) {
        console.log('✅ Password matches! Authentication should work.');
    } else {
        console.log('❌ Password does NOT match!');
        console.log('\nTesting other common passwords:');

        const commonPasswords = ['password123', '12345', '123456789', 'password', 'test123'];
        for (const pwd of commonPasswords) {
            const match = await bcrypt.compare(pwd, user.password);
            if (match) {
                console.log(`   ✅ Found match: "${pwd}"`);
                return;
            } else {
                console.log(`   ❌ Not: "${pwd}"`);
            }
        }

        console.log('\n🔧 Creating a test hash for "123456" to compare:');
        const testHash = await bcrypt.hash(testPassword, 10);
        console.log(`   New hash: ${testHash}`);

        const verify = await bcrypt.compare(testPassword, testHash);
        console.log(`   Verification of new hash: ${verify ? '✅ Works' : '❌ Failed'}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
