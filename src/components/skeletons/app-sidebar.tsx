'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Skeleton } from '@/components/ui/skeleton';

const navigationItems = new Array(5).fill(null);

export function AppSidebarSkeleton() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navigationItems.map((_, index) => (
                        <SidebarMenuItem key={index} className="px-2">
                            <SidebarMenuButton asChild className="px-2">
                                <div className="flex w-full items-center">
                                    <Skeleton className="size-4 mr-2" />
                                    <Skeleton className="h-4 flex-grow" />
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Skeleton className="size-4 mr-2" />
                            <Skeleton className="h-4 w-12" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="size-4 ml-auto" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
