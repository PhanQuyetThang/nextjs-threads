"use client"

import { sidebarLinks } from '@/constants';
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LeftSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col px-6">
                {sidebarLinks.map((link, index) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                    return (
                        <Link
                            href={link.route}
                            key={link.label}
                            className={`py-3 my-1 leftsidebar_link ${isActive && 'bg-primary-500 '} hover:bg-primary-500 duration-300`}
                        >
                            <Image src={link.imgURL} alt={link.label} height={24} width={24} />
                            <p className='text-light-1 max-lg:hidden'>{link.label}</p>
                        </Link>
                    )

                })}
            </div>
            <div className='mt-10 px-6'>
                <SignedIn>
                    <SignOutButton signOutCallback={() => {
                        router.push('/sign-in')
                    }}>
                        <div className="flex cursor-pointer gap-2 px-4">
                            <Image src="/assets/logout.svg" alt="logout" height={24} width={24} />
                            <p className='text-light-2 max-lg:hidden'>Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar;