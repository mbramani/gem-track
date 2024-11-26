import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { CreateFormSkeleton } from '@/components/skeletons/forms';
import { EmployeeCreateForm } from '@/components/forms/employee-form';
import { Suspense } from 'react';

export default function EmployeeCreatePage() {
    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">
                Create New Employee
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Employee Information</CardTitle>
                    <CardDescription>
                        Enter the details of the new employee
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<CreateFormSkeleton />}>
                        <EmployeeCreateForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
