import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function BreadcrumbHeaderSkeleton() {
    return (
        <header className="flex items-center h-16 px-4 border-b bg-background">
            <nav
                aria-label="Breadcrumb"
                className="flex items-center space-x-4"
            >
                <SidebarTrigger className="shrink-0" />
                <ol className="flex items-center space-x-2">
                    <li>
                        <Skeleton className="h-4 w-4" />
                    </li>
                    <li className="text-sm font-medium text-muted-foreground">
                        /
                    </li>
                    <li>
                        <Skeleton className="h-4 w-20" />
                    </li>
                    <li className="text-sm font-medium text-muted-foreground">
                        /
                    </li>
                    <li>
                        <Skeleton className="h-4 w-24" />
                    </li>
                </ol>
            </nav>
        </header>
    );
}
