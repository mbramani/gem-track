-- CreateEnum
CREATE TYPE "DiamondColor" AS ENUM ('D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');

-- CreateEnum
CREATE TYPE "DiamondPurity" AS ENUM ('FL', 'IF', 'I1', 'I2', 'I3', 'SI1', 'SI2', 'VS1', 'VS2', 'VVS1', 'VVS2');

-- CreateEnum
CREATE TYPE "DiamondShape" AS ENUM ('Asscher', 'Cushion', 'Emerald', 'Heart', 'Marquise', 'Oval', 'Pear', 'Princess', 'Radiant', 'Round');

-- CreateTable
CREATE TABLE "DiamondPacket" (
    "id" TEXT NOT NULL,
    "diamondPacketId" VARCHAR(255) NOT NULL,
    "batchNo" DECIMAL(10,2),
    "evNo" INTEGER,
    "packetNo" DECIMAL,
    "lot" SMALLINT,
    "piece" SMALLINT,
    "makeableWeight" DECIMAL(10,4) NOT NULL,
    "expectedWeight" DECIMAL(10,4) NOT NULL,
    "booterWeight" DECIMAL(10,4) NOT NULL,
    "diamondShape" "DiamondShape" NOT NULL,
    "diamondColor" "DiamondColor" NOT NULL,
    "diamondPurity" "DiamondPurity" NOT NULL,
    "size" DECIMAL(10,4) NOT NULL,
    "expectedPercentage" DECIMAL(10,4) NOT NULL,
    "receiveDateTime" TIMESTAMPTZ NOT NULL,
    "deliveryDateTime" TIMESTAMPTZ,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiamondPacket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiamondPacket" ADD CONSTRAINT "DiamondPacket_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiamondPacket" ADD CONSTRAINT "DiamondPacket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
