'use client';

import { AlertCircle, ArrowRight } from 'lucide-react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';

export function ErrorPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount <= 1) {
                    clearInterval(timer);
                    router.push('/login');
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <main className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center text-2xl font-bold text-destructive">
                        <AlertCircle className="w-8 h-8 mr-2" />
                        Error
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-lg mb-4">Something went wrong.</p>
                    <p className="text-muted-foreground">
                        You will be redirected to the login page in {countdown}{' '}
                        seconds.
                    </p>
                    <Progress value={(5 - countdown) * 20} className="mt-4" />
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/login')}
                    >
                        Go to Login
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
}
