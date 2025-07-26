import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AuthContextProvider } from "@/context/auth";
import { getSessionToken } from "@/lib/session.server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Myconid",
  description: "Mycological Identification Webapp",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionToken();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthContextProvider session={session || null}>
          <Header />
          <main className="flex flex-col gap-[32px] row-start-2 py-5 items-center">
            {children}
          </main>
        </AuthContextProvider>
      </body>
    </html>
  );
}
