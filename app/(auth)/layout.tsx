import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../globals.css"

export const metadata = {
    Title: "Threads",
    Description: "A Next.js 13 Meta Threads Application"
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} flex justify-center items-center mt-8 bg-light-2`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}
