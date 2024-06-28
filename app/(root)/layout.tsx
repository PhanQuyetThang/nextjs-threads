import Bottombar from "@/components/shared/Bottombar"
import LeftSidebar from "@/components/shared/LeftSidebar"
import RightSidebar from "@/components/shared/RightSidebar"
import Topbar from "@/components/shared/Topbar"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import { Toaster } from 'react-hot-toast';
import { Suspense } from "react"
import Loading from "@/components/ui/loading"
import "../globals.css"
import { Metadata } from "next"
import Script from "next/script";
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads Application",
};

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-1834KJV041"></Script>
        <Script id="google-analytics">
          {
            `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1834KJV041');`

          }
        </Script>
        <body className={`${inter.className} bg-light-1`}>
          <Toaster position="top-center" />
          <Topbar />
          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-5xl">
                {children}
              </div>
            </section>
            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  )
}
