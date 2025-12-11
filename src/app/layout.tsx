import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "./analytics";

export const metadata: Metadata = {
  title: "TikiAnaly Blog",
  description: "Latest football news and analysis",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress browser extension connection errors
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('Could not establish connection')) {
                  e.preventDefault();
                  return false;
                }
              });
              
              // Suppress unhandled promise rejections from extensions
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && e.reason.message.includes('Could not establish connection')) {
                  e.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        <div className='flex flex-col min-h-screen'>
          <Header />
          <main className='flex-1 min-h-[80vh] page-padding-x py-4'>
            {children}
            <Analytics />
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
