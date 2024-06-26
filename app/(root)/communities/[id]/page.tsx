import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { addMemberToCommunity, fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";

async function Page({ params }: { params: { id: string } }) {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const communityDetails = await fetchCommunityDetails(params.id);
    return (
        <section>
            <ProfileHeader
                accountId={communityDetails?.id}
                authUserId={user?.id}
                name={communityDetails?.name}
                username={communityDetails?.username}
                imageUrl={communityDetails?.image}
                bio={communityDetails?.bio}
                type="Community"
            />
            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {communityTabs.map((tab) => (
                            <TabsTrigger
                                key={tab?.label}
                                value={tab?.value}
                                className="tab"
                            >
                                <Image
                                    src={tab?.icon}
                                    alt={tab?.label}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                                <p className="max-sm:hidden">
                                    {tab?.label}
                                </p>
                                {tab.label === "Threads" && (
                                    <p className="ml-1 rounded-md bg-light-2 px-2 py-1 !text-tiny-medium text-dark-2">
                                        {communityDetails?.threads?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="threads"
                        className="w-full text-gray-1">
                        <ThreadsTab
                            currentUserId={user?.id}
                            accountId={communityDetails?._id}
                            accountType="Community"
                        />
                    </TabsContent>
                    <TabsContent value="members"
                        className="w-full text-gray-1">
                        <section className="mt-9 flex flex-col gap-10">
                            {communityDetails?.members?.map((member: any) => (
                                <UserCard
                                    key={member?.id}
                                    id={member?.id}
                                    name={member?.name}
                                    username={member?.username}
                                    imgUrl={member?.image}
                                    personType="User"
                                />
                            ))}
                        </section>
                    </TabsContent>
                    <TabsContent value="requests"
                        className="w-full text-gray-1">
                        <ThreadsTab
                            currentUserId={user?.id}
                            accountId={communityDetails?._id}
                            accountType="Community"
                        />
                    </TabsContent>

                </Tabs>
            </div>
        </section>
    )
}

export default Page;