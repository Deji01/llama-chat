import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Chatbot App",
  description: "Chatbot UI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cookieStore = cookies()
  // const defaultOpen = (await cookieStore).get("sidebar:state")?.value === "true"

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen bg-background`}>
        {/* <SidebarProvider defaultOpen={defaultOpen}> */}
        <SidebarProvider>
          <ChatSidebar />
          <main className="flex-1 overflow-hidden">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
