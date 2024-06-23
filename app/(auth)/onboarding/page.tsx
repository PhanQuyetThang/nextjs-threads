import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";

async function Page() {
    const user = await currentUser();
    // console.log(user);

    const userInfo = {};
    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || `${user?.firstName || ''} ${user?.lastName || ''}`,
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl,
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