"use server"

import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser(
    {
        userId,
        username,
        name,
        bio,
        image,
        path
    }: Params
): Promise<void> {
    connectToDB();
    try {
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true }
        );

        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Error create/update user: ${error}`);
    }
}

export async function fetchUser(userId: string) {
    connectToDB();
    try {
        const user = await User.findOne({ id: userId })
        // .populate({
        //     path: "communities",
        //     model: Community,
        // });
        return user;
    } catch (error: any) {
        throw new Error(`Error fetching user: ${error.message}`);
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    //Calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;
    try {
        //Fetch the posts that have no parents (top level threads...)
        const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: -1 })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: 'author',
                model: User,
            })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: '_id name parentId image'
                }
            });

        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
        const posts = await postQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length;
        return { posts, isNext };

    } catch (error) {
        throw new Error(`Error fetching posts: ${error.message}`);
    }
}