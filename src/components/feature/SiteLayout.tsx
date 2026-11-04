import type { ReactNode } from "react";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import MobileBookBar from "@/components/feature/MobileBookBar";

interface SiteLayoutProps {
  children: ReactNode;
  /** hide the mobile sticky book bar on the booking page itself */
  hideMobileBook?: boolean;
}

export default function SiteLayout({ children, hideMobileBook = false }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background-50">
      <Navbar />
      <main className="w-full flex-1">{children}</main>
      <Footer />
      {!hideMobileBook && <MobileBookBar />}
    </div>
  );
}