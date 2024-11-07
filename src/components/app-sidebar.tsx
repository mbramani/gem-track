'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

const navigationItems = [
    { name: 'Client', icon: User, href: '/dashboard/client' },
    {
        name: 'Diamond Packet',
        icon: Package,
        href: '/dashboard/diamond-packet',
    },
    { name: 'Process', icon: Settings, href: '/dashboard/process' },
    { name: 'Employee', icon: Briefcase, href: '/dashboard/employee' },
    { name: 'Report', icon: BarChart, href: '/dashboard/report' },
];

export function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [activePage, setActivePage] = useState('');
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const currentItem = navigationItems.find((item) =>
            pathname.startsWith(item.href)
        );
        if (currentItem) {
            setActivePage(currentItem.name);
        }
    }, [pathname]);

    function handleSidebarMenuButtonClick(item: (typeof navigationItems)[0]) {
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
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src="/placeholder.svg?height=32&width=32"
                                    alt="Gem Track"
                                />
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
                                className="px-2"
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                    {activePage === item.name && (
                                        <ChevronRight className="ml-auto h-4 w-4" />
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    {theme === 'light' ? (
                                        <Sun className="h-4 w-4" />
                                    ) : theme === 'dark' ? (
                                        <Moon className="h-4 w-4" />
                                    ) : (
                                        <Sun className="h-4 w-4" />
                                    )}
                                    <span className="ml-1">Theme</span>
                                    <span className="sr-only">
                                        Toggle theme
                                    </span>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem
                                    onClick={() => setTheme('light')}
                                >
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme('dark')}
                                >
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme('system')}
                                >
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src="/placeholder.svg?height=32&width=32"
                                            alt="User"
                                        />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="font-semibold">
                                            John Doe
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            john@example.com
                                        </span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto h-4 w-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
