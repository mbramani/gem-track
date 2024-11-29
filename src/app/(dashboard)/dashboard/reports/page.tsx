'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ReportsTable } from '@/components/tables/reports-table';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/skeletons/table';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
    const router = useRouter();
    return (
        <div className="container mx-auto py-10 px-2 max-w-[100vw] lg:max-w-screen-lg ">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">Reports </h1>
                <Button onClick={() => router.push('reports/create')}>
                    <Plus className="size-4" /> Add New Reports
                </Button>
            </div>
            <Suspense fallback={<TableSkeleton columns={4} rows={10} />}>
                <ReportsTable />
            </Suspense>
        </div>
    );
}
