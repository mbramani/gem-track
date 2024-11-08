import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ReactNode, Suspense } from 'react';

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return (
        <section className="container mx-auto py-10 px-4 max-w-screen-md">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                        Manage your profile and address information
                    </CardDescription>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </section>
    );
}
