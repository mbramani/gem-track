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
