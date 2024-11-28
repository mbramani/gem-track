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
    params: Promise<{ id: string; processId: string }>;
}) {
    let diamondPacket, assignedProcess;
    try {
        const { id, processId } = await params;

        idSchema.parse({ id });
        idSchema.parse({ id: processId });

        const [diamondPacketResponse, processResponse] = await Promise.all([
            trpc.diamondPacket.getById({ id }),
            trpc.diamondPacket.getAssignedProcessById({ id: processId }),
        ]);

        diamondPacket = diamondPacketResponse.diamondPacket;
        assignedProcess = processResponse.assignedProcess;

        if (!diamondPacket || !assignedProcess) {
            return notFound();
        }
    } catch {
        return notFound();
    }

    return (
        <section className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">
                Update Assigned Process
            </h1>
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle>Update Assigned Process</CardTitle>
                    <CardDescription>
                        Update the details of the assigned process
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AssignedPacketForm
                        diamondPacketId={diamondPacket.id}
                        initialValues={JSON.parse(
                            JSON.stringify(assignedProcess)
                        )}
                        type="update"
                    />
                </CardContent>
            </Card>
        </section>
    );
}
