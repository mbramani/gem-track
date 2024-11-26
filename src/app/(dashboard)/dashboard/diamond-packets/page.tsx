'use client';

import { Button } from '@/components/ui/button';
import { DiamondPacketsTable } from '@/components/tables/diamond-packets-table';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/skeletons/table';
import { useRouter } from 'next/navigation';

export default function DiamondPacketsPage() {
    const router = useRouter();
    return (
        <div className="container mx-auto py-10 px-2 max-w-[100vw] lg:max-w-screen-lg ">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">
                    Diamond Packets
                </h1>
                <Button onClick={() => router.push('diamond-packets/create')}>
                    <Plus className="h-4 w-4" /> Add New Diamond Packet
                </Button>
            </div>
            <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
                <DiamondPacketsTable />
            </Suspense>
        </div>
    );
}
