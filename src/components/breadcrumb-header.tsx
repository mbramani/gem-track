'use client';

import { ChevronRight, Home } from 'lucide-react';

import Link from 'next/link';
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

export function BreadcrumbHeader() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    return (
        <header className="flex items-center h-16 px-4 border-b bg-background">
            <nav
                aria-label="Breadcrumb"
                className="flex items-center space-x-4"
            >
                <SidebarTrigger className="shrink-0" />
                <ol className="flex items-center space-x-2">
                    {paths.map((path, index) => {
                        const href = `/${paths.slice(0, index + 1).join('/')}`;
                        const isLast = index === paths.length - 1;
                        return (
                            <React.Fragment key={path}>
                                <li className="text-sm font-medium text-muted-foreground">
                                    <ChevronRight className="h-4 w-4" />
                                </li>
                                <li>
                                    {isLast ? (
                                        <span
                                            className="text-sm font-medium text-foreground"
                                            aria-current="page"
                                        >
                                            {path}
                                        </span>
                                    ) : (
                                        <Link
                                            href={href}
                                            className="text-sm font-medium text-muted-foreground hover:text-foreground"
                                        >
                                            {path}
                                        </Link>
                                    )}
                                </li>
                            </React.Fragment>
                        );
                    })}
                </ol>
            </nav>
        </header>
    );
}
