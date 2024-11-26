import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { ReactNode } from 'react';

export default function ClientEditLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <section className="container mx-auto py-10 px-4 max-w-screen-md">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">Edit Client</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                    <CardDescription>
                        Update the client&apos;s details and address
                    </CardDescription>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </section>
    );
}
