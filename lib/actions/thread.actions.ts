"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createThread({ text, author, communityId, path }: Params) {
    try {
        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

        //Update user model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread?._id }
        });

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating thread: ${error.message}`);
    }
}

export async function fetchThreadById(id: string) {
    try {
        connectToDB();
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image",
            })
            .populate({
                path: 'children',
                populate: [{
                    path: 'author',
                    model: User,
                    select: "_id id name parentId image",
                },
                {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image",
                    },
                }]
            }).exec();
        return thread;
    } catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`);
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
) {
    try {
        connectToDB();

        //Find the original thread by its ID
        const originalThread = await Thread.findById(threadId);
        if (!originalThread) {
            throw new Error("Thread not found");
        }

        //Create a nre thread with the comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        })

        //Save the new thread
        const savedCommentThread = await commentThread.save();
        console.log("Check saved comment thread: ", savedCommentThread?._id);


        //Update the original thread to include the new comment
        originalThread.children.push(savedCommentThread?._id);


        //Save the original thread
        await originalThread.save();

        revalidatePath(path);

    } catch (error: any) {
        throw new Error(`Error adding comment to thread: ${error.message}`);
    }
}