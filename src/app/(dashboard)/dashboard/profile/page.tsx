import {
    AddressFormSkeleton,
    ProfileFormSkeleton,
} from '@/components/skeletons/forms';

import { AddressForm } from '@/components/forms/address-form';
import { ProfileForm } from '@/components/forms/profile-from';
import { Suspense } from 'react';
import { TabWrapper } from '@/components/tab-wrapper';
import { trpc } from '@/trpc/server';

export default async function ProfilePage() {
    const { profile } = await trpc.user.getProfile();
    return (
        <TabWrapper
            tabs={[
                {
                    value: 'profile',
                    label: 'Profile',
                    component: (
                        <Suspense fallback={<ProfileFormSkeleton />}>
                            <ProfileForm />
                        </Suspense>
                    ),
                },
                {
                    value: 'address',
                    label: 'Address',
                    component: (
                        <Suspense fallback={<AddressFormSkeleton />}>
                            <AddressForm addressId={profile.addressId} />
                        </Suspense>
                    ),
                },
            ]}
        />
    );
}
