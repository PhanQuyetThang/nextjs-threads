import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';

async function Page() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const userInfo = await fetchUser(user?.id);
    console.log("Check user info: ", userInfo);
    const userId = userInfo._id.toString();

    if (!userInfo?.onboarded) redirect('/onboarding');

    return (
        <>
            <h1 className="head-text">Create Thread</h1>
            <PostThread userId={userId} />
        </>
    );
}

export default Page;
