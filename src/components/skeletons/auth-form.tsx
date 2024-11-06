import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

import { Skeleton } from '../ui/skeleton';

export function AuthFormSkeleton() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-2">
                <Skeleton
                    className="h-8 w-3/4"
                    aria-label="Loading form title"
                />
                <Skeleton
                    className="h-4 w-full"
                    aria-label="Loading form subtitle"
                />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton
                        className="h-4 w-20"
                        aria-label="Loading email label"
                    />
                    <Skeleton
                        className="h-10 w-full"
                        aria-label="Loading email input"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Skeleton
                            className="h-4 w-20"
                            aria-label="Loading password label"
                        />
                        <Skeleton
                            className="h-4 w-32"
                            aria-label="Loading forgot password link"
                        />
                    </div>
                    <Skeleton
                        className="h-10 w-full"
                        aria-label="Loading password input"
                    />
                </div>
                <Skeleton
                    className="h-10 w-full"
                    aria-label="Loading submit button"
                />
            </CardContent>
            <CardFooter>
                <Skeleton
                    className="h-4 w-full"
                    aria-label="Loading register link"
                />
            </CardFooter>
        </Card>
    );
}
