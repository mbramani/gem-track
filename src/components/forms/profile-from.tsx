'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { profileSchema } from '@/schemas';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
    const [{ profile }] = trpc.user.getProfile.useSuspenseQuery();

    const updateProfileMutation = trpc.user.updateProfile.useMutation({
        onError(error) {
            toast({
                title: 'Update failed',
                description: error.message,
                variant: 'destructive',
            });
        },
        onSuccess() {
            toast({
                title: 'Profile updated',
                description:
                    'Profile information has been updated successfully.',
            });
        },
    });

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: profile.name,
            email: profile.email,
            phoneNo: profile.phoneNo,
            gstInNo: profile.gstInNo,
        },
    });

    function onProfileFormSubmit(data: ProfileFormValues) {
        updateProfileMutation.mutate(data);
    }

    return (
        <Form {...profileForm}>
            <form
                onSubmit={profileForm.handleSubmit(onProfileFormSubmit)}
                className="space-y-8"
            >
                <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="john@example.com"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={profileForm.control}
                    name="phoneNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="1234567890" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={profileForm.control}
                    name="gstInNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>GSTIN Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="22AAAAA0000A1Z5"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    aria-label="Update Profile"
                >
                    {updateProfileMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        'Update Profile'
                    )}
                </Button>
            </form>
        </Form>
    );
}
