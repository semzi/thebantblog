"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Highlight from "@/components/Highlight";
import BlogList from "@/components/BlogList";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className='flex-1 min-h-[80vh] py-4'>
        <div className='gap-y-7 flex flex-col'>
          <Highlight />
          <BlogList />
        </div>
      </main>
      
    </div>
  );
}
