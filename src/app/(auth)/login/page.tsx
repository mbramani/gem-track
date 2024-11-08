import { AuthForm } from '@/components/forms/auth-form';
import { AuthFormSkeleton } from '@/components/skeletons/forms';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Login - Gem Track',
    description: 'Login to your Gem Track account',
};

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">
                        Gem Track
                    </h1>
                </header>
                <Suspense fallback={<AuthFormSkeleton />}>
                    <AuthForm />
                </Suspense>
            </div>
        </main>
    );
}
