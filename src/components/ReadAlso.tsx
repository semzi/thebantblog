"use client";
import React from "react";
import { useFetch } from "@/lib/hooks/useFetch";
import { getAllPosts } from "@/lib/api/endpoints";
import Link from "next/link";

interface Blog {
  _id?: string;
  id?: string;
  title?: string;
  imageUrl?: string;
  createdAt?: string;
}

interface ApiResponse {
  responseObject?: {
    items?: Blog[];
  };
}

const ReadAlso: React.FC<{ currentId?: string }> = ({ currentId }) => {
  const { data, loading, error } = useFetch(getAllPosts, []);
  const items = (data as ApiResponse)?.responseObject?.items ?? [];
  const filtered = items
    .filter((p: Blog) => String(p._id ?? p.id) !== String(currentId))
    .slice(0, 7);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center bg-snow-100 rounded py-3 px-4">
            <div className="w-32 h-20 bg-snow-200 rounded-md mr-4 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-snow-200 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-snow-200 rounded w-24 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (error) return <p>{error}</p>;

  const formatDate = (value?: string) => {
    if (!value) return "";
    try { return new Date(value).toLocaleDateString('en-US', { timeZone: 'UTC' }); } catch { return ""; }
  };

  return (
    <div>
      <div className="space-y-4">
        {filtered.map((blog: Blog) => (
          <Link
            href={`/blog/${blog._id ?? blog.id}`}
            key={`${blog._id ?? blog.id}-${blog.title ?? ''}`}
            className="flex items-center cursor-pointer bg-snow-100 hover:bg-snow-200 transition-colors rounded py-3 px-4"
          >
            <img
              src={blog?.imageUrl || undefined}
              alt={blog.title}
              className="w-32 h-20 object-cover rounded-md mr-4"
            />
            <div className="flex flex-col justify-between h-full flex-1">
              <h3 className="text-sm ">{blog.title && blog.title.length > 60 ? `${blog.title.slice(0, 50)}…` : blog.title}</h3>
              <div className="flex items-center text-xs text-gray-500 space-x-3">
                <span suppressHydrationWarning>{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReadAlso;


