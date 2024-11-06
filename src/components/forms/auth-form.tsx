'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { loginSchema } from '@/schemas/login-schema';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type AuthFormValues = z.infer<typeof loginSchema>;

export default function AuthForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const loginMutation = trpc.auth.login.useMutation({
        onError(error) {
            toast({
                title: 'Login failed',
                description: error.message,
                variant: 'destructive',
            });
        },
        onSuccess() {
            const redirectUrl = searchParams.get('redirect') || '/dashboard';
            router.push(redirectUrl);
        },
    });

    const form = useForm<AuthFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: AuthFormValues) => {
        loginMutation.mutate(data);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Please enter your email and password to log in.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            placeholder="you@example.com"
                                            aria-label="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage aria-live="assertive" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <FormLabel htmlFor="password">
                                            Password
                                        </FormLabel>
                                        <Link
                                            href="/forgot-password"
                                            className="text-primary underline-offset-4 hover:underline text-sm p-0 h-auto font-normal"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="********"
                                            aria-label="Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage aria-live="assertive" />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loginMutation.isPending}
                            aria-label="Log in"
                        >
                            {loginMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                'Log in'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link
                    href="/contact-us"
                    className="text-primary underline-offset-4 hover:underline text-sm p-0 h-auto font-normal"
                >
                    Don&apos;t have an account? Register
                </Link>
            </CardFooter>
        </Card>
    );
}
