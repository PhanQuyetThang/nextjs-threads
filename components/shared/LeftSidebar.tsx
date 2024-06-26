"use client"

import { sidebarLinks } from '@/constants';
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";
import { Lancelot } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LeftSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { userId } = useAuth();
    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col px-6">
                {sidebarLinks.map((link, index) => {
                    const isActive = (pathname.includes(link?.route) && link?.route?.length > 1) || pathname === link?.route;

                    if (link?.route === '/profile') link.route = `${link?.route}/${userId}`;

                    return (
                        <Link
                            href={link?.route}
                            key={link?.label}
                            className={`py-3 my-1 leftsidebar_link ${isActive && 'bg-gray-100 '} hover:bg-gray-100 duration-300`}
                        >
                            <Image src={link?.imgURL} alt={link?.label} height={24} width={24} />
                            <p className='text-gray-1 max-lg:hidden'>{link?.label}</p>
                        </Link>
                    )
                })}
            </div>
            <div className='mt-10 px-6'>
                <SignedIn>
                    <SignOutButton signOutCallback={() => {
                        router.push('/sign-in')
                    }}>
                        <div className="flex cursor-pointer gap-2 px-4 py-3 rounded-md text-danger-1 hover:bg-red-100 duration-300">
                            <Image src="/assets/logout.svg" alt="logout" height={24} width={24} />
                            <p className='max-lg:hidden'>Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar;