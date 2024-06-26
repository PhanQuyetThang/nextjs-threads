"use server"

import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

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
                username: username?.toLowerCase(),
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

        const isNext = totalPostsCount > skipAmount + posts?.length;
        return { posts, isNext };

    } catch (error: any) {
        throw new Error(`Error fetching posts: ${error.message}`);
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectToDB();
        //Find all threads authored by the user with the given userId
        const threads = await User.findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            });

        return threads;
    } catch (error: any) {
        throw new Error(`Error fetching user posts: ${error.message}`);
    }
}

export async function fetchUsers({
    userId,
    searchString = '',
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc',

}: {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try {
        connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, 'i');
        const query: FilterQuery<typeof User> = {
            id: { $ne: userId },
        }

        if (searchString?.trim() !== '') {
            query.$or = [
                { username: regex },
                { name: regex },
            ]
        }

        const sortOptions = { createdBy: sortBy };

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount + users?.length;

        return { users, isNext };
    } catch (error: any) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
}

export async function getActivity(userId: string) {

    try {
        connectToDB();

        //Find all threads created by the user
        const userThreads = await Thread.find({ author: userId });

        //Collect a;; the child thread ids (replies) from the 'children' field
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread?.children);
        }, [])

        const replies = await Thread.find({
            _id: { $in: childThreadIds },
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })

        return replies;
    } catch (error: any) {
        throw new Error(`Error fetching activity: ${error.message}`);
    }
}