import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import Link from "next/link";

async function Page() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const userInfo = await fetchUser(user.id);
    console.log("Check user info: ", userInfo.threads);
    if (!userInfo?.onboarded) redirect('/onboarding');

    //getActivity
    const activity = await getActivity(userInfo._id);
    console.log("Check activity: ", activity);



    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>

            <section className="mt-10 flex flex-col gap-5">
                {activity.length > 0 ? (
                    <>
                        {activity.map((activity) => (
                            <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                                <article className="activity-card">
                                    <Image
                                        src={activity.author.image}
                                        alt="Profile Picture"
                                        width={20}
                                        height={20}
                                        className="rounded-full object-cover"
                                    />
                                    <p className="!text-small-regular text-gray-1">
                                        <span className="mr-1 text-black text-small-semibold">
                                            {activity.author.name}
                                        </span>{" "}
                                        replied to your thread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className="!text-base-regular text-gray-1">No activity yet</p>

                )}
            </section>
        </section>
    )
}

export default Page;