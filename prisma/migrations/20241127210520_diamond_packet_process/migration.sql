-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "DiamondPacketProcess" (
    "id" TEXT NOT NULL,
    "status" "ProcessStatus" NOT NULL DEFAULT 'PENDING',
    "startDateTime" TIMESTAMPTZ NOT NULL,
    "endDateTime" TIMESTAMPTZ,
    "beforeWeight" DECIMAL(10,4) NOT NULL,
    "afterWeight" DECIMAL(10,4),
    "remarks" TEXT,
    "diamondPacketId" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiamondPacketProcess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiamondPacketProcess" ADD CONSTRAINT "DiamondPacketProcess_diamondPacketId_fkey" FOREIGN KEY ("diamondPacketId") REFERENCES "DiamondPacket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiamondPacketProcess" ADD CONSTRAINT "DiamondPacketProcess_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiamondPacketProcess" ADD CONSTRAINT "DiamondPacketProcess_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiamondPacketProcess" ADD CONSTRAINT "DiamondPacketProcess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
