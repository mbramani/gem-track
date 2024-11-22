import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

import { Skeleton } from '../ui/skeleton';

function FormFieldSkeleton({ fields = 4 }: { fields?: number }) {
    return (
        <>
            {[...Array(fields)].map((_, index) => (
                <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </>
    );
}
export function AuthFormSkeleton() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-4 w-full" />
            </CardFooter>
        </Card>
    );
}

export function ProfileFormSkeleton() {
    return (
        <div className="space-y-8">
            <FormFieldSkeleton fields={4} />
            <div className="flex justify-between">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

export function AddressFormSkeleton() {
    return (
        <div className="space-y-8">
            <FormFieldSkeleton fields={6} />
            <div className="flex justify-between">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

export function ClientFormSkeleton() {
    return (
        <div className="space-y-8">
            <FormFieldSkeleton fields={5} />
            <div className="flex justify-between">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

export function EmployeeFormSkeleton() {
    return ClientFormSkeleton();
}

export function CreateFormSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-6 w-28" />
                </div>
                <FormFieldSkeleton fields={5} />
            </div>
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-6 w-28" />
                </div>
                <FormFieldSkeleton fields={5} />
                <div className="flex justify-end gap-2">
                    <Skeleton className="ml-auto h-10 w-32" />
                    <Skeleton className="ml-auto h-10 w-32" />
                </div>
            </div>
        </div>
    );
}
