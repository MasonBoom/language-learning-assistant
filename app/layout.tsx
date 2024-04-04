"use client";
import React, { useEffect, useState } from "react";
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
    const noHeaderFooterPages = ["/", "/Login", "/SignUp", "LanguageSelection", "/ForgotPassword"];

    setShowHeaderFooter(!noHeaderFooterPages.includes(pathname));
  }, [pathname]);

  return (
    <html lang="en">
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
