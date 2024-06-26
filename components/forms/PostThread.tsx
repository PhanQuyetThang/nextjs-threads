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
import * as z from 'zod';
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";

import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from '@/lib/actions/thread.actions';
import toast from "react-hot-toast";
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


function PostThread({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { organization } = useOrganization();

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: "",
            accountId: userId,
        }
    })

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        setLoading(true);
        await createThread({
            text: values?.thread,
            author: userId,
            communityId: organization ? organization.id : null,
            path: pathname,
        });
        toast.success("Thread created successfully");
        setTimeout(() => {
            router.push('/');
        }, 1000);

    }
    return (
        <>
            <Form {...form}>

                <form
                    onSubmit={form?.handleSubmit(onSubmit)}
                    className="flex flex-col justify-start gap-1 bg-light-1 px-3 py-4 rounded-md">

                    <FormField
                        control={form?.control}
                        name="thread"
                        render={({ field }) => (
                            <FormItem className="flex flex-col w-full items-start gap-1 mb-4">
                                <FormLabel className="text-base-semibold text-gray-2">
                                    Thread
                                </FormLabel>
                                <FormControl className="flex-1 text-base-semibold text-gray-2">
                                    <Textarea
                                        className='no-focus border-gray-3'
                                        rows={10}
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
        </>
    )
}

export default PostThread;