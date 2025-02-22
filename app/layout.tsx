import type { Metadata, Viewport } from "next"
import { PostHogProvider } from '@/components/providers/PostHogPorvider'
import PostHogPageView from '@/components/providers/PostHogPageView'
import SessionProvider from "@/components/providers/SessionProvider"
import { getServerSession } from "next-auth"
import authOptions from "@/app/lib/authOptions"
import Nav from "@/components/Nav"
import "./globals.css"

export const metadata: Metadata = {
  title: "Word Weave",
  description: "A daily word puzzle where you arrange anargrams to creat the most words",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
        <body className={`h-svh w-svw bg-slate-100`}>
          <PostHogProvider>
            <PostHogPageView />
            <SessionProvider session={session}>
              <Nav />
              {children}
            </SessionProvider>
          </PostHogProvider>
        </body>
      </html>
  );
}
