"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidation } from "@/lib/validations/user";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from 'zod';
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from '@/lib/uploadthing'
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Toaster } from 'react-hot-toast';

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false);
    const { startUpload } = useUploadThing("media");
    const pathname = usePathname();
    const router = useRouter();


    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image || '',
            name: user?.name || '',
            username: user?.username || '',
            bio: user?.bio || ''
        }
    })

    const handleImage = (e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e?.target?.files && e?.target?.files?.length > 0) {
            const file = e?.target?.files[0];
            setFiles(Array.from(e?.target?.files));

            if (!file.type.includes('image')) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || '';

                fieldChange(imageDataUrl);
            }

            fileReader.readAsDataURL(file);

        }
    }

    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
        const blob = values?.profile_photo;

        const hasImageChanged = isBase64Image(blob);

        if (hasImageChanged) {
            const imgRes = await startUpload(files);

            if (imgRes && imgRes[0].url) {
                values.profile_photo = imgRes[0].url;
            }
        }
        await updateUser(
            {
                userId: user?.id,
                username: values?.username,
                name: values?.name,
                bio: values?.bio,
                image: values?.profile_photo,
                path: pathname
            }
        )
        if (pathname === '/profile/edit') {
            toast.success("Profile updated successfully");
            router.back();
        } else {
            toast.success("Profile updated successfully");
            setTimeout(() => {
                router.push('/');
            }, 1000);
        }
    }
    return (
        <div>
            <Toaster position="top-center" />
            <Form {...form}>
                <form
                    onSubmit={form?.handleSubmit(onSubmit)}
                    className="flex flex-col justify-start gap-1 bg-light-1 px-3 py-4 rounded-md">
                    <FormField
                        control={form?.control}
                        name="profile_photo"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-4 mb-4">
                                <FormLabel className="account-form_image-label">
                                    {field?.value ? (
                                        <Image
                                            src={field?.value}
                                            alt="profile photo"
                                            width={96}
                                            height={96}
                                            priority
                                            className="rounded-full object-contain"
                                        />
                                    ) : (
                                        <Image
                                            src="/assets/profile.svg"
                                            alt="profile photo"
                                            width={24}
                                            height={24}
                                            priority
                                            className="object-contain"
                                        />
                                    )}
                                </FormLabel>
                                <FormControl className="flex-1 text-base-semibold text-gray-200">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        placeholder="Upload a profile photo"
                                        className="account-form_image-input"
                                        onChange={(e) => handleImage(e, field.onChange)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form?.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="flex flex-col w-full items-start gap-1 mb-4">
                                <FormLabel className="text-base-semibold text-light-2">
                                    Name
                                </FormLabel>
                                <FormControl className="flex-1 text-base-semibold text-gray-200">
                                    <Input
                                        type="text"
                                        className="account-form_input no-focus"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form?.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="flex flex-col w-full items-start gap-1 mb-4">
                                <FormLabel className="text-base-semibold text-light-2">
                                    Username
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        className="account-form_input no-focus"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form?.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem className="flex flex-col w-full items-start gap-1 mb-4">
                                <FormLabel className="text-base-semibold text-light-2">
                                    Bio
                                </FormLabel>
                                <FormControl className="flex-1 text-base-semibold text-gray-200">
                                    <Textarea
                                        rows={10}
                                        className="account-form_input no-focus"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default AccountProfile;