// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Utility functions
function generatePhoneNumber() {
    return `${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
}

function generateGSTIN() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    const stateCode = Math.floor(Math.random() * 35 + 1)
        .toString()
        .padStart(2, '0');

    const pan = [
        Array(5)
            .fill(null)
            .map(() => chars[Math.floor(Math.random() * chars.length)])
            .join(''),
        Array(4)
            .fill(null)
            .map(() => digits[Math.floor(Math.random() * digits.length)])
            .join(''),
        chars[Math.floor(Math.random() * chars.length)],
    ].join('');

    const entityNumber = digits[Math.floor(Math.random() * digits.length)];

    const fixedZ = 'Z';

    const checksum = chars[Math.floor(Math.random() * chars.length)];

    return `${stateCode}${pan}${entityNumber}${fixedZ}${checksum}`;
}

function generateAddress() {
    const streets = [
        'MG Road',
        'Ring Road',
        'Station Road',
        'Market Road',
        'Main Street',
    ];
    const areas = ['Varachha', 'Katargam', 'Adajan', 'Vesu', 'Athwalines'];
    const cities = ['Surat', 'Ahmedabad', 'Mumbai', 'Delhi', 'Bangalore'];
    const states = ['Gujarat', 'Maharashtra', 'Delhi', 'Karnataka'];
    const countries = ['India'];

    return {
        addressLine1: `${Math.floor(Math.random() * 999) + 1}, ${streets[Math.floor(Math.random() * streets.length)]}`,
        addressLine2: areas[Math.floor(Math.random() * areas.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        state: states[Math.floor(Math.random() * states.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        postalCode: Math.floor(Math.random() * 900000 + 100000).toString(),
    };
}

async function seed() {
    try {
        console.log(`🚀 Seeding started...`);

        // Cleanup
        await prisma.client.deleteMany();
        await prisma.address.deleteMany();
        await prisma.user.deleteMany();

        // Create test user with address
        const userAddress = await prisma.address.create({
            data: generateAddress(),
        });

        const hashedPassword = await hash('Test@1234', 10);
        const user = await prisma.user.create({
            data: {
                email: 'test@gem-track.com',
                name: 'Test User',
                password: hashedPassword,
                phoneNo: generatePhoneNumber(),
                gstInNo: generateGSTIN(),
                addressId: userAddress.id,
            },
        });

        // Create 20 test clients with addresses
        const clients = await Promise.all(
            Array.from({ length: 20 }, async (_, i) => {
                const clientAddress = await prisma.address.create({
                    data: generateAddress(),
                });

                return await prisma.client.create({
                    data: {
                        clientId: `2024${(i + 1).toString().padStart(2, '0')}`,
                        name: `Client ${i + 1}`,
                        email: `client${i + 1}@example.com`,
                        phoneNo: generatePhoneNumber(),
                        gstInNo: generateGSTIN(),
                        userId: user.id,
                        addressId: clientAddress.id,
                    },
                });
            })
        );

        console.log(`🌟 Seeding completed successfully!`);
        console.log(`👤 User: ${user.email}`);
        console.log(`🔑 Password: Test@1234`);
        console.log(`👥 Number of clients created: ${clients.length}`);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
