import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

import { Skeleton } from '../ui/skeleton';

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
            {[...Array(4)].map((_, index) => (
                <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-full max-w-md" />
                </div>
            ))}
            <Skeleton className="h-10 w-32" />
        </div>
    );
}

export function AddressFormSkeleton() {
    return (
        <div className="space-y-8">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
            <Skeleton className="h-10 w-32" />
        </div>
    );
}
