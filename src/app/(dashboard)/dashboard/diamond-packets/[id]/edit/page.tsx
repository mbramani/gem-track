import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { DiamondPacketEditForm } from '@/components/forms/diamond-packet-form';
import { idSchema } from '@/schemas';
import { notFound } from 'next/navigation';
import { trpc } from '@/trpc/server';

export default async function ClientEditPage({
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
                Edit Diamond Packet
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Diamond Packet Information</CardTitle>
                    <CardDescription>
                        Update the diamond packet&apos;s details and address
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DiamondPacketEditForm
                        initialValues={JSON.parse(
                            JSON.stringify(diamondPacket)
                        )}
                    />
                </CardContent>
            </Card>
        </section>
    );
}
