import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { AssignedPacketForm } from '@/components/forms/assigned-packet-form';
import { idSchema } from '@/schemas';
import { notFound } from 'next/navigation';
import { trpc } from '@/trpc/server';

export default async function AssignPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    let id, diamondPacket;
    try {
        id = (await params)?.id;
        idSchema.parse({ id });
        const response = await trpc.diamondPacket.getById({ id });
        diamondPacket = response.diamondPacket;

        if (!diamondPacket) {
            return notFound();
        }
    } catch {
        return notFound();
    }

    return (
        <section className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">
                Assign Process
            </h1>
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle>Assign Process to Diamond Packet</CardTitle>
                    <CardDescription>
                        Assign a new process to the diamond packet
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AssignedPacketForm
                        diamondPacketId={diamondPacket.id}
                        initialValues={JSON.parse(
                            JSON.stringify({
                                beforeWeight: diamondPacket.finalWeight,
                            })
                        )}
                    />
                </CardContent>
            </Card>
        </section>
    );
}
