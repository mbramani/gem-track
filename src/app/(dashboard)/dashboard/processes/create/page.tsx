import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { FormSkeleton } from '@/components/skeletons/forms';
import { ProcessCreateForm } from '@/components/forms/process-form';
import { Suspense } from 'react';

export default function ProcessCreatePage() {
    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">
                Create Diamond Packet
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Diamond Packet</CardTitle>
                    <CardDescription>
                        Enter the details of the diamond packet
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<FormSkeleton fields={5} />}>
                        <ProcessCreateForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
