import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pen, Plus } from 'lucide-react';

import { AssignedProcessesTable } from '@/components/tables/assigned-processes-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { idSchema } from '@/schemas';
import { notFound } from 'next/navigation';
import { trpc } from '@/trpc/server';

export default async function DiamondPacketShowPage({
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
        <section className="container mx-auto py-8 px-4 sm:px-6 lg:px-8  max-w-[100vw] md:max-w-screen-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-8">
                    Diamond Packet Details
                </h1>
                <Button asChild>
                    <Link href={`${diamondPacket.id}/edit`}>
                        <Pen className="mr-2 size-4" />
                        Edit
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="font-semibold">Packet ID</dt>
                                <dd>{diamondPacket.diamondPacketId}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Batch No</dt>
                                <dd>
                                    {diamondPacket?.batchNo?.toString() ||
                                        'N/A'}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold">EV No</dt>
                                <dd>{diamondPacket.evNo}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Packet No</dt>
                                <dd>
                                    {diamondPacket?.packetNo?.toString() ||
                                        'N/A'}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Lot</dt>
                                <dd>{diamondPacket.lot}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Piece</dt>
                                <dd>{diamondPacket.piece}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Diamond Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="font-semibold">Shape</dt>
                                <dd>{diamondPacket.diamondShape}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Color</dt>
                                <dd>{diamondPacket.diamondColor}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Purity</dt>
                                <dd>{diamondPacket.diamondPurity}</dd>
                            </div>
                            {/* <div>
                                <dt className="font-semibold">Quality Grade</dt>
                                <dd>{diamondPacket.qualityGrade}</dd>
                            </div> */}
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Weight Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="font-semibold">Makeable Wt.</dt>
                                <dd>
                                    {diamondPacket.makeableWeight.toString()} ct
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Expected Wt.</dt>
                                <dd>
                                    {diamondPacket.expectedWeight.toString()} ct
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Booter Wt.</dt>
                                <dd>
                                    {diamondPacket.booterWeight.toString()} ct
                                </dd>
                            </div>

                            <div>
                                <dt className="font-semibold">Final Wt.</dt>
                                <dd>
                                    {diamondPacket.finalWeight.toString()} ct
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold">
                                    Expected Wt. Percentage
                                </dt>
                                <dd>
                                    {diamondPacket.expectedPercentage.toFixed(
                                        2
                                    )}
                                    %
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold">
                                    Final Wt. Percentage
                                </dt>
                                <dd>
                                    {diamondPacket.finalPercentage.toFixed(2)}%
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Dates and Client</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="font-semibold">Receive Date</dt>
                                <dd>
                                    {formatDate(diamondPacket.receiveDateTime)}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Delivery Date</dt>
                                <dd>
                                    {diamondPacket?.deliveryDateTime
                                        ? formatDate(
                                              diamondPacket.deliveryDateTime
                                          )
                                        : 'N/A'}
                                </dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="font-semibold">Client</dt>
                                <dd>{diamondPacket.client.name}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
            <section aria-labelledby="processes-title" className="mb-8">
                <h2
                    id="processes-title"
                    className="text-xl md:text-2xl font-bold"
                >
                    Processes
                </h2>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-muted-foreground">
                        Showing processes applied to this diamond packet
                    </p>
                    <Button asChild>
                        <Link href={`${diamondPacket.id}/assign`}>
                            <Plus className="mr-2 size-4" />
                            Add Process
                        </Link>
                    </Button>
                </div>
                <AssignedProcessesTable diamondPacketId={diamondPacket.id} />
            </section>
        </section>
    );
}
