import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient().$extends({
    result: {
        diamondPacket: {
            size: {
                needs: { makeableWeight: true, piece: true },
                compute(diamondPacket) {
                    return (
                        Number(diamondPacket.makeableWeight) /
                        (diamondPacket?.piece || 1)
                    );
                },
            },
            expectedPercentage: {
                needs: { makeableWeight: true, expectedWeight: true },
                compute(diamondPacket) {
                    return (
                        (Number(diamondPacket.expectedWeight) /
                            Number(diamondPacket.makeableWeight)) *
                        100
                    );
                },
            },
        },
    },
});
