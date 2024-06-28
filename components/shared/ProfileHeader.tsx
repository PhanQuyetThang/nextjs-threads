import Image from "next/image";

interface Props {
    accountId: string;
    authUserId: string;
    name: string;
    username: string;
    imageUrl: string;
    bio: string;
    type: "User" | "Community";
}

const ProfileHeader = ({
    accountId,
    authUserId,
    name,
    username,
    imageUrl,
    bio,
    type
}: Props) => {

    return (
        <div className="flex w-full flex-col justify-start">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative h-20 w-20 object-cover">
                        <Image
                            src={imageUrl}
                            alt="Profile image"
                            fill
                            className="rounded-full"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-left text-heading3-bold text-gray-1">
                            {name}
                        </h2>
                        <p className="text-base-medium text-gray-2">
                            @{username}
                        </p>
                    </div>
                </div>
                <p className="text-gray-2 follow">
                    {accountId === authUserId ? "Edit Profile" : "Follow"}
                </p>
            </div>
            <p className="mt-6 max-w-lg text-base-regular text-gray-2">
                {bio}
            </p>
            <div className="mt-12 h-[1px] w-full bg-gray-2" />
        </div>
    )
}

export default ProfileHeader;