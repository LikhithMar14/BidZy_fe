import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/providers/providers";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BidZy - Modern Auctions",
  description: "Bid on live auctions in real time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 min-h-screen`} suppressHydrationWarning={true}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}