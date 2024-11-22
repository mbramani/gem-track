import {
    AddressFormSkeleton,
    ClientFormSkeleton,
} from '@/components/skeletons/forms';

import { AddressForm } from '@/components/forms/address-form';
import { ClientEditForm } from '@/components/forms/client-form';
import { Suspense } from 'react';
import { TabWrapper } from '@/components/tab-wrapper';
import { idSchema } from '@/schemas';
import { notFound } from 'next/navigation';
import { trpc } from '@/trpc/server';

export default async function ClientEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params)?.id;
    idSchema.parse({ id });
    const { client } = await trpc.client.getById({ id });

    if (!client) {
        return notFound();
    }

    return (
        <TabWrapper
            tabs={[
                {
                    value: 'client',
                    label: 'Client',
                    component: (
                        <Suspense fallback={<ClientFormSkeleton />}>
                            <ClientEditForm id={id} />
                        </Suspense>
                    ),
                },
                {
                    value: 'address',
                    label: 'Address',
                    component: (
                        <Suspense fallback={<AddressFormSkeleton />}>
                            <AddressForm addressId={client.addressId} />
                        </Suspense>
                    ),
                },
            ]}
        />
    );
}
