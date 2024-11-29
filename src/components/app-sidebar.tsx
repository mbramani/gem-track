'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    BarChart,
    Briefcase,
    ChevronRight,
    ChevronsUpDown,
    LogOut,
    Moon,
    Package,
    Settings,
    Sun,
    User,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FC, useEffect, useState } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';
import { useTheme } from 'next-themes';

interface NavigationItem {
    name: string;
    icon: FC<{ className?: string }>;
    href: string;
}

const navigationItems: NavigationItem[] = [
    { name: 'Clients', icon: User, href: '/dashboard/clients' },
    {
        name: 'Diamond Packets',
        icon: Package,
        href: '/dashboard/diamond-packets',
    },
    { name: 'Processes', icon: Settings, href: '/dashboard/processes' },
    { name: 'Employees', icon: Briefcase, href: '/dashboard/employees' },
    { name: 'Reports', icon: BarChart, href: '/dashboard/reports' },
];

export function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [activePage, setActivePage] = useState<string>('');
    const [{ profile }] = trpc.user.getProfile.useSuspenseQuery();

    useEffect(() => {
        const currentItem = navigationItems.find((item) =>
            pathname.startsWith(item.href)
        );
        if (currentItem) {
            setActivePage(currentItem.name);
        }
    }, [pathname]);

    function handleSidebarMenuButtonClick(item: NavigationItem) {
        setActivePage(item.name);
        router.push(item.href);
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            onClick={() => router.push('/dashboard')}
                        >
                            <Avatar className="size-8">
                                <AvatarFallback>GT</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="font-semibold"></span>
                                <span className="text-xs text-muted-foreground">
                                    Dashboard
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navigationItems.map((item) => (
                        <SidebarMenuItem key={item.name} className="px-2">
                            <SidebarMenuButton
                                asChild
                                isActive={activePage === item.name}
                                onClick={() =>
                                    handleSidebarMenuButtonClick(item)
                                }
                                className="px-2 my-0.5"
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                >
                                    <item.icon className="size-4" />
                                    <span>{item.name}</span>
                                    {activePage === item.name && (
                                        <ChevronRight className="ml-auto size-4" />
                                    )}
                                </Button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <ThemeToggle />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <UserMenu user={profile} />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                    {theme === 'light' ? (
                        <Sun className="size-4" />
                    ) : theme === 'dark' ? (
                        <Moon className="size-4" />
                    ) : (
                        <Sun className="size-4" />
                    )}
                    <span className="ml-1">Theme</span>
                    <span className="sr-only">Toggle theme</span>
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function UserMenu({ user }: { user: { name: string; email: string } }) {
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                    <Avatar className="size-8">
                        <AvatarFallback>
                            {user.name.at(0)?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {user.email}
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => router.push('/dashboard/profile')}
                    className="cursor-pointer"
                >
                    <User className="mr-2 size-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push('/dashboard/settings')}
                    className="cursor-pointer"
                >
                    <Settings className="mr-2 size-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.push('/login')}
                    className="cursor-pointer"
                >
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
