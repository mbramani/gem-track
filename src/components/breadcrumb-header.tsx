'use client';

import { Fragment, useMemo } from 'react';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

export function BreadcrumbHeader() {
    const pathname = usePathname();
    const paths = useMemo(
        () => pathname.split('/').filter(Boolean),
        [pathname]
    );

    return (
        <header className="flex items-center h-auto md:h-16 py-2 px-4 border-b bg-background">
            <nav
                aria-label="Breadcrumb"
                className="flex items-center space-x-3"
            >
                <SidebarTrigger className="shrink-0" />
                <ol className="flex flex-wrap items-center space-x-2">
                    {paths.map((path, index) => {
                        const href = `/${paths.slice(0, index + 1).join('/')}`;
                        const isLast = index === paths.length - 1;
                        return (
                            <BreadcrumbItem
                                key={path}
                                path={path}
                                href={href}
                                isLast={isLast}
                            />
                        );
                    })}
                </ol>
            </nav>
        </header>
    );
}

function BreadcrumbItem({
    path,
    href,
    isLast,
}: {
    path: string;
    href: string;
    isLast: boolean;
}) {
    const pathName = path.charAt(0).toUpperCase() + path.slice(1);
    return (
        <Fragment key={path}>
            <li className="text-sm font-medium text-muted-foreground">
                <ChevronRight className="h-4 w-4" />
            </li>
            <li>
                {isLast ? (
                    <span
                        className="text-sm font-medium text-foreground"
                        aria-current="page"
                    >
                        {pathName}
                    </span>
                ) : (
                    <Link
                        href={href}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        {pathName}
                    </Link>
                )}
            </li>
        </Fragment>
    );
}
