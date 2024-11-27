// prisma/seed.ts

import {
    DiamondColor,
    DiamondPurity,
    DiamondShape,
    PrismaClient,
} from '@prisma/client';

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

    const pan = generatePanNo();

    const entityNumber = digits[Math.floor(Math.random() * digits.length)];

    const fixedZ = 'Z';

    const checksum = chars[Math.floor(Math.random() * chars.length)];

    return `${stateCode}${pan}${entityNumber}${fixedZ}${checksum}`;
}

function generatePanNo() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    const panNo = [
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

    return panNo;
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

function getRandomEnumValue<T extends object>(enumObj: T): T[keyof T] {
    const values = Object.values(enumObj) as T[keyof T][];
    return values[Math.floor(Math.random() * values.length)];
}

async function seed() {
    try {
        console.log(`🚀 Seeding started...`);

        // Cleanup
        await prisma.client.deleteMany();
        await prisma.address.deleteMany();
        await prisma.user.deleteMany();
        await prisma.diamondPacket.deleteMany();
        await prisma.process.deleteMany();

        // Create test user with address
        const userAddress = await prisma.address.create({
            data: generateAddress(),
        });

        const hashedPassword = await hash('Test@1234', 10);
        const user = await prisma.user.create({
            data: {
                email: 'test@gemtrack.com',
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
                        clientId: `2024C${(i + 1).toString().padStart(2, '0')}`,
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

        // Create 15 test employees with addresses
        const employees = await Promise.all(
            Array.from({ length: 15 }, async (_, i) => {
                const employeesAddress = await prisma.address.create({
                    data: generateAddress(),
                });

                return await prisma.employee.create({
                    data: {
                        employeeId: `2024E${(i + 1).toString().padStart(2, '0')}`,
                        name: `Employee ${i + 1}`,
                        email: `employee${i + 1}@example.com`,
                        phoneNo: generatePhoneNumber(),
                        panNo: generatePanNo(),
                        userId: user.id,
                        addressId: employeesAddress.id,
                    },
                });
            })
        );

        // Create 25 test diamond packet
        const diamondPackets = await Promise.all(
            Array.from({ length: 25 }, async (_, i) => {
                const client =
                    clients[Math.floor(Math.random() * clients.length)];

                const piece = Math.floor(Math.random() * 9) + 1;
                const makeableWeight = Number(
                    (Math.random() * 50 + 10).toFixed(4)
                );
                const expectedWeight = Number(
                    (makeableWeight * (0.7 + Math.random() * 0.2)).toFixed(4)
                );
                const booterWeight = Number(
                    (expectedWeight * (0.8 + Math.random() * 0.15)).toFixed(4)
                );

                // Calculate computed values
                const size = Number((makeableWeight / piece).toFixed(4));
                const expectedPercentage = Number(
                    ((expectedWeight / makeableWeight) * 100).toFixed(2)
                );

                return await prisma.diamondPacket.create({
                    data: {
                        diamondPacketId: `DP${String(i + 1).padStart(4, '0')}`,
                        batchNo: Number((Math.random() * 100).toFixed(2)),
                        evNo: Math.floor(Math.random() * 1000),
                        packetNo: Number((Math.random() * 100).toFixed(2)),
                        lot: Math.floor(Math.random() * 100),
                        piece,
                        makeableWeight,
                        expectedWeight,
                        booterWeight,
                        size,
                        expectedPercentage,
                        diamondShape: getRandomEnumValue(DiamondShape),
                        diamondColor: getRandomEnumValue(DiamondColor),
                        diamondPurity: getRandomEnumValue(DiamondPurity),
                        receiveDateTime: new Date(),
                        clientId: client.id,
                        userId: user.id,
                    },
                });
            })
        );

        // Create 5 test process
        const processes = await Promise.all(
            Array.from({ length: 5 }, async (_, i) => {
                return await prisma.process.create({
                    data: {
                        processId: `P${String(i + 1).padStart(4, '0')}`,
                        name: `Process ${i + 1}`,
                        description: `Description for Process ${i + 1}`,
                        price: Number((Math.random() * 1000 + 100).toFixed(4)),
                        cost: Number((Math.random() * 500 + 50).toFixed(4)),
                        userId: user.id,
                    },
                });
            })
        );

        console.log(`🌟 Seeding completed successfully!`);
        console.log(`👤 User: ${user.email}`);
        console.log(`🔑 Password: Test@1234`);
        console.log(`👥 Number of clients created: ${clients.length}`);
        console.log(`👷 Number of employees created: ${employees.length}`);
        console.log(
            `💎 Number of diamond packets created: ${diamondPackets.length}`
        );
        console.log(`⚙️ Number of processes created: ${processes.length}`);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
