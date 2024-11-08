import { HydrateClient, trpc } from '@/trpc/server';

import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarSkeleton } from '@/components/skeletons/app-sidebar';
import { BreadcrumbHeader } from '@/components/breadcrumb-header';
import { BreadcrumbHeaderSkeleton } from '@/components/skeletons/breadcrumb-header';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorPage } from '@/components/error-page';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Suspense } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    void trpc.user.getProfile.prefetch();

    return (
        <HydrateClient>
            <ErrorBoundary fallback={<ErrorPage />}>
                <SidebarProvider>
                    <Suspense fallback={<AppSidebarSkeleton />}>
                        <AppSidebar />
                    </Suspense>
                    <main className="flex-1 bg-background ">
                        <Suspense fallback={<BreadcrumbHeaderSkeleton />}>
                            <BreadcrumbHeader />
                        </Suspense>
                        <div className="w-full overflow-y-auto">{children}</div>
                    </main>
                </SidebarProvider>
            </ErrorBoundary>
        </HydrateClient>
    );
}
