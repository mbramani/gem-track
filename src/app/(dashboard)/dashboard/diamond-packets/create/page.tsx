import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { CreateFormSkeleton } from '@/components/skeletons/forms';
import { DiamondPacketCreateForm } from '@/components/forms/diamond-packet-form';
import { Suspense } from 'react';

export default function CreateDiamondPacketPage() {
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
                    <Suspense fallback={<CreateFormSkeleton fields={8} />}>
                        <DiamondPacketCreateForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}

{
    /* <Card className="w-full max-w-3xl mx-auto">
<CardHeader>
    <CardTitle>
        {isEditing
            ? 'Edit Diamond Packet'
            : 'Create Diamond Packet'}
    </CardTitle>
    <CardDescription>
        Enter the details of the diamond packet
    </CardDescription>
</CardHeader>
<CardContent> */
}
