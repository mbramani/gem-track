import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { ProcessEditForm } from '@/components/forms/process-form';
import { idSchema } from '@/schemas';
import { notFound } from 'next/navigation';
import { trpc } from '@/trpc/server';

export default async function ProcessEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    let id, process;
    try {
        id = (await params)?.id;
        idSchema.parse({ id });
        const response = await trpc.process.getById({ id });
        process = response.process;

        if (!process) {
            return notFound();
        }
    } catch {
        return notFound();
    }

    return (
        <section className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">
                Edit Process
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Process Information</CardTitle>
                    <CardDescription>
                        Update the process&apos;s details and address
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProcessEditForm
                        initialValues={JSON.parse(JSON.stringify(process))}
                    />
                </CardContent>
            </Card>
        </section>
    );
}
