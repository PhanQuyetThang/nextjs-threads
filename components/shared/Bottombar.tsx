"use client"

import { usePathname, useRouter } from 'next/navigation';
import { sidebarLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
const Bottombar = () => {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <section className="bottombar">
            <div className="bottombar_container">
                {sidebarLinks.map((link, index) => {
                    const isActive = (pathname.includes(link?.route) && link?.route?.length > 1) || pathname === link?.route;

                    return (
                        <Link
                            href={link?.route}
                            key={link?.label}
                            className={`py-3 my-1 bottombar_link ${isActive && 'bg-primary-500 '} hover:bg-primary-500 duration-300`}
                        >
                            <Image src={link?.imgURL} alt={link?.label} height={24} width={24} />
                            <p className='text-subtle-medium text-light-1 max-sm:hidden'>{link?.label?.split(/\s+/)[0]}</p>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default Bottombar;