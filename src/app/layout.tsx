import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["100","200","300","400","500","600","700","800","900"],
  style: ["normal","italic"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TikiAnaly Blog",
  description: "Latest football news and analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${poppins.variable} antialiased`}>
        <div className='flex flex-col min-h-screen'>
          <Header />
          <main className='flex-1 min-h-[80vh] page-padding-x py-4'>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
