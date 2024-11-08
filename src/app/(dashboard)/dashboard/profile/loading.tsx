import {
    AddressFormSkeleton,
    ProfileFormSkeleton,
} from '@/components/skeletons/forms';

import { TabWrapper } from '@/components/tab-wrapper';

export default function ProfilePageSkeleton() {
    return (
        <TabWrapper
            tabs={[
                {
                    value: 'profile',
                    label: 'Profile',
                    component: <ProfileFormSkeleton />,
                },
                {
                    value: 'address',
                    label: 'Address',
                    component: <AddressFormSkeleton />,
                },
            ]}
        />
    );
}
