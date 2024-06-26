import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import UserCard from "@/components/cards/UserCard";

async function Page() {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const userInfo = await fetchUser(user?.id);

    //Fetch users
    const result = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25,

    });

    if (!userInfo?.onboarded) redirect('/onboarding');
    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            {/* SEARCH BAR */}

            <div className="mt-14 flex flex-col gap-9">
                {result?.users?.length === 0 ? (
                    <p className="no-result">No Users</p>
                ) : (
                    <>
                        {result.users.map((person) => (
                            <UserCard
                                key={person?.id}
                                id={person?.id}
                                name={person?.name}
                                username={person?.username}
                                imgUrl={person?.image}
                                personType="User"
                            />
                        )
                        )}
                    </>
                )}
            </div>
        </section>
    )
}

export default Page;