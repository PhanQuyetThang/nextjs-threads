import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user?.id);
    if (userInfo?.onboarded) redirect('/');
    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: userInfo ? userInfo?.username : user?.username,
        name: userInfo ? userInfo?.name : `${user?.firstName || ''} ${user?.lastName || ''}`,
        bio: userInfo ? userInfo?.bio : "",
        image: userInfo ? userInfo?.image : user?.imageUrl,
    }

    return (
        <main className="flex mx-auto max-w-3xl flex-col justify-start px-10 pb-4">
            <h1 className="head-text">
                Onboarding
            </h1>
            <p className="text-base-regular text-light-2">Complete your profile to use Threads</p>

            <section className="bg-light-1 p-10 rounded-xl shadow-xl">
                <AccountProfile
                    user={userData}
                    btnTitle="Continue" />
            </section>
        </main>
    )
}

export default Page;