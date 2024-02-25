"use client";
import React, { useEffect, useState } from "react";
import useUserData from "@/components/customHooks/useUserData";
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
  const { userData } = useUserData();
  const pathname = usePathname();

  useEffect(() => {
    if (!userData.firstLogin) {
      const noHeaderFooterPages = ["/", "/Login", "/SignUp"];
      setShowHeaderFooter(!noHeaderFooterPages.includes(pathname));
    } else {
      const noHeaderFooterPages = [
        "/",
        "/Login",
        "/SignUp",
        "/LanguageSelection",
      ];
      setShowHeaderFooter(!noHeaderFooterPages.includes(pathname));
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        {showHeaderFooter && <Header />}
        <main>{children}</main>
        {showHeaderFooter && <Footer />}
      </body>
    </html>
  );
}
