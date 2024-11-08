'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useState } from 'react';

interface Tab {
    value: string;
    label: string;
    component: JSX.Element;
}

interface TabWrapperProps {
    tabs: Tab[];
}

export function TabWrapper({ tabs }: TabWrapperProps) {
    const [activeTab, setActiveTab] = useState<string>(tabs[0].value);

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="py-4">
                    {tab.component}
                </TabsContent>
            ))}
        </Tabs>
    );
}
