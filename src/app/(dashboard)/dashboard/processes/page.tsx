'use client';

import { Button } from '@/components/ui/button';
import { DiamondPacketsTable } from '@/components/tables/diamond-packets-table';
import { Plus } from 'lucide-react';
import { ProcessesTable } from '@/components/tables/processes-table';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/skeletons/table';
import { useRouter } from 'next/navigation';

export default function ProcessesPage() {
    const router = useRouter();
    return (
        <div className="container mx-auto py-10 px-2 max-w-[100vw] lg:max-w-screen-lg ">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">Processes </h1>
                <Button onClick={() => router.push('Processes/create')}>
                    <Plus className="size-4" /> Add New Processes
                </Button>
            </div>
            <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
                <ProcessesTable />
            </Suspense>
        </div>
    );
}
