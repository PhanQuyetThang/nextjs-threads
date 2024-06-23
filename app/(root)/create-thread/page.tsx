import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
// import NotifyButton from "@/components/ui/NotifyButton";

async function Page() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const userInfo = await fetchUser(user.id);
    console.log("Check user info: ", userInfo);
    // Chuyển đổi userInfo._id thành chuỗi
    const userId = userInfo._id.toString();

    if (!userInfo?.onboarded) redirect('/onboarding');

    return (
        <>
            <h1 className="head-text">Create Thread</h1>
            {/* <NotifyButton /> */}
            <PostThread userId={userId} />
        </>
    );
}

export default Page;
