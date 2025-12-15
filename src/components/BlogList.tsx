"use client";
import { useState } from "react";
import { getAllPosts } from "@/lib/api/endpoints";
import { useFetch } from "@/lib/hooks/useFetch";
import Link from "next/link";
import Image from "next/image";

interface Blog {
  _id?: string;
  id?: string;
  title: string;
  imageUrl?: string;
  createdAt?: string;
  time?: string;
  views?: number;
}

interface ApiResponse {
  responseObject?: {
    items?: Blog[];
    totalPages?: number;
    currentPage?: number;
    totalItems?: number;
  };
}

const BlogList: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 20;
  
  const { data, loading, error } = useFetch(() => getAllPosts(page, limit), [page]);
  const items = (data as ApiResponse)?.responseObject?.items ?? [];
  const totalPages = (data as ApiResponse)?.responseObject?.totalPages ?? 1;
  const currentPage = (data as ApiResponse)?.responseObject?.currentPage ?? page;

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center bg-snow-100 rounded shadow py-3 px-4">
          <div className="aspect-video h-20 bg-snow-200 rounded-md mr-3 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-snow-200 rounded w-2/3 mb-2 animate-pulse" />
            <div className="flex gap-3">
              <div className="h-3 bg-snow-200 rounded w-16 animate-pulse" />
              <div className="h-3 bg-snow-200 rounded w-3 animate-pulse" />
              <div className="h-3 bg-snow-200 rounded w-24 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  if (error) return <p>{error}</p>;

  const formatDate = (value?: string) => {
    if (!value) return "";
    try { return new Date(value).toLocaleDateString('en-US', { timeZone: 'UTC' }); } catch { return ""; }
  };

  return (
    <div>
      <div className="space-y-3">
        {items.slice(1).map(function (blog: Blog) {
          return (
            <Link
              href={`/blog/${blog._id ?? blog.id}`}
              key={(blog._id ?? blog.id) + blog.title}
              className="flex  items-center cursor-pointer bg-snow-100 hover:bg-snow-200 transition-colors rounded shadow py-3 px-4"
            >
              <div className="relative aspect-video h-20 mr-3">
                <Image
                  src={blog?.imageUrl || '/logos/logo.png'}
                  alt={blog.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col justify-between h-20 flex-1">
                <h3 className="text-sm md:text-base md:font-semibold">
                  <span className="md:hidden">
                    {blog.title && blog.title.length > 60 ? `${blog.title.slice(0, 60)}…` : blog.title}
                  </span>
                  <span className="hidden md:inline">{blog.title}</span>
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span suppressHydrationWarning>{blog.time ?? formatDate(blog.createdAt)}</span>
                  
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={currentPage <= 1 || loading}
          className="px-4 py-2 rounded-l bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <span className="px-4 py-2 bg-white text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages || loading}
          className="px-4 py-2 rounded-r bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogList;


