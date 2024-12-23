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
    let id, client;
    try {
        id = (await params)?.id;
        idSchema.parse({ id });
        const response = await trpc.client.getById({ id });
        client = response.client;

        if (!client) {
            return notFound();
        }
    } catch {
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
