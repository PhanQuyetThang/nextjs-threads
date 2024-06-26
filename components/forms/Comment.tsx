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
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread, createThread } from '@/lib/actions/thread.actions';
import toast from "react-hot-toast";

interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
            accountId: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        setLoading(true);
        await addCommentToThread(
            threadId,
            values?.thread,
            JSON.parse(currentUserId),
            pathname
        );

        form.reset();
        toast.success("Thread created successfully");
        // setTimeout(() => {
        //     router.push('/');
        // }, 1000);

    }

    return (
        <>
            <Form {...form}>

                <form
                    onSubmit={form?.handleSubmit(onSubmit)}
                    className="comment-form">

                    <FormField
                        control={form?.control}
                        name="thread"
                        render={({ field }) => (
                            <FormItem className="flex w-full items-center gap-3">
                                <FormLabel>
                                    <Image
                                        src={currentUserImg}
                                        alt="Profile image"
                                        width={48}
                                        height={48}
                                        className="rounded-full cursor-pointer object-contain"
                                    />
                                </FormLabel>
                                <FormControl className="bg-transparent border-none">
                                    <Input
                                        className='no-focus'
                                        placeholder="Comment..."
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="comment-form_btn">Reply</Button>
                </form>
            </Form>
        </>
    )
}

export default Comment;