import {
    AddressFormSkeleton,
    EmployeeFormSkeleton,
} from '@/components/skeletons/forms';

import { AddressForm } from '@/components/forms/address-form';
import { EmployeeEditForm } from '@/components/forms/employee-form';
import { Suspense } from 'react';
import { TabWrapper } from '@/components/tab-wrapper';
import { idSchema } from '@/schemas';
import { notFound } from 'next/navigation';
import { trpc } from '@/trpc/server';

export default async function EmployeeEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    let id, employee;
    try {
        id = (await params)?.id;
        idSchema.parse({ id });
        const result = await trpc.employee.getById({ id });
        employee = result.employee;

        if (!employee) {
            return notFound();
        }
    } catch {
        return notFound();
    }

    return (
        <TabWrapper
            tabs={[
                {
                    value: 'employee',
                    label: 'Employee',
                    component: (
                        <Suspense fallback={<EmployeeFormSkeleton />}>
                            <EmployeeEditForm id={id} />
                        </Suspense>
                    ),
                },
                {
                    value: 'address',
                    label: 'Address',
                    component: (
                        <Suspense fallback={<AddressFormSkeleton />}>
                            <AddressForm addressId={employee.addressId} />
                        </Suspense>
                    ),
                },
            ]}
        />
    );
}
