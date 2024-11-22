'use client';

import { Button } from '@/components/ui/button';
import { ClientsTable } from '@/components/tables/clients-table';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/skeletons/table';
import { useRouter } from 'next/navigation';

export default function ClientsPage() {
    const router = useRouter();
    return (
        <div className="container mx-auto py-10 px-2 max-w-[100vw] lg:max-w-screen-lg">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Clients</h1>
                <Button onClick={() => router.push('clients/create')}>
                    <Plus className="h-4 w-4" /> Add New Client
                </Button>
            </div>
            <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
                <ClientsTable />
            </Suspense>
        </div>
    );
}
