import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { ClientCreateForm } from '@/components/forms/client-form';
import { CreateFormSkeleton } from '@/components/skeletons/forms';
import { Suspense } from 'react';

export default function CreateClientPage() {
    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">
                Create New Client
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                    <CardDescription>
                        Enter the details of the new client
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<CreateFormSkeleton />}>
                        <ClientCreateForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
