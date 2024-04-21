"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { usePathname } from "next/navigation";
import Footer from "@/components/footer";
import Header from "@/components/header";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkPath = (path: string): boolean => {
      const noHeaderFooterPages = [
        "/",
        "/Login",
        "/SignUp",
        "/LanguageSelection",
        "/ForgotPassword",
      ];
      if (noHeaderFooterPages.includes(path)) {
        return true;
      }
      if (path.startsWith("/ForgotPassword/")) {
        return true;
      }
      return false;
    };

    setShowHeaderFooter(!checkPath(pathname));
  }, [pathname]);

  return (
    <html lang="en">
      <Head>
        <title>LingoListen AI</title>
        <meta
          name="description"
          content="An AI language learning app built with Next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <main className="flex flex-col">
          {showHeaderFooter && <Header />}
          <div>{children}</div>
          {showHeaderFooter && <Footer />}
        </main>
      </body>
    </html>
  );
}
