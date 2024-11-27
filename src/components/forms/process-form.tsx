'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { processSchema } from '@/schemas';
import { Process } from '@prisma/client';
type ProcessFormValues = z.infer<typeof processSchema>;

interface ProcessFormProps {
    form: ReturnType<typeof useForm<ProcessFormValues>>;
    onSubmit: (data: ProcessFormValues) => void;
    type: 'create' | 'edit';
    isPending: boolean;
}

export function ProcessCreateForm() {
    const router = useRouter();

    const form = useForm<ProcessFormValues>({
        resolver: zodResolver(processSchema),
        defaultValues: {
            processId: '',
            name: '',
            description: '',
            price: 0,
            cost: 0,
        },
    });

    const processCreateMutation = trpc.process.create.useMutation({
        onSuccess: () => {
            toast({
                title: 'Process created',
                description: 'Process has been created successfully.',
            });
            router.push('/dashboard/processes');
        },
        onError: (error) => {
            toast({
                title: 'Error creating process',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    function onSubmit(data: ProcessFormValues) {
        processCreateMutation.mutate(data);
    }

    return (
        <ProcessForm
            type="create"
            form={form}
            onSubmit={onSubmit}
            isPending={processCreateMutation.isPending}
        />
    );
}

export function ProcessEditForm({ initialValues }: { initialValues: Process }) {
    const router = useRouter();

    const form = useForm<ProcessFormValues>({
        resolver: zodResolver(processSchema),
        defaultValues: {
            processId: initialValues.processId,
            name: initialValues.name,
            description: initialValues.description || '',
            price: Number(initialValues.price) || 0,
            cost: Number(initialValues.cost) || 0,
        },
    });

    const processEditMutation = trpc.process.update.useMutation({
        onSuccess: (data) => {
            toast({
                title: 'Process updated',
                description: data.message,
            });
            router.push('/dashboard/processes');
        },
        onError: (error) => {
            toast({
                title: 'Error updating process',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    function onSubmit(data: ProcessFormValues) {
        processEditMutation.mutate({
            ...data,
            id: initialValues.id,
        });
    }

    return (
        <ProcessForm
            type="edit"
            form={form}
            onSubmit={onSubmit}
            isPending={processEditMutation.isPending}
        />
    );
}

function ProcessForm({ type, form, onSubmit, isPending }: ProcessFormProps) {
    const router = useRouter();

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="processId"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Process ID</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} className="min-h-24" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseFloat(e.target.value)
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Cost</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseFloat(e.target.value)
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                {type === 'edit'
                                    ? 'Updating...'
                                    : 'Creating...'}
                            </>
                        ) : type === 'edit' ? (
                            'Update Process'
                        ) : (
                            'Create Process'
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
