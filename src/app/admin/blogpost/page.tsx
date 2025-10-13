"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllPosts, deleteBlogPost } from "@/lib/api/endpoints";
import Image from "next/image";

interface Blog {
  _id?: string;
  id?: string;
  title: string;
  imageUrl?: string;
  createdAt: string;
}

interface ApiResponse {
  responseObject?: {
    items?: Blog[];
  };
}

export default function BlogPostListPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/signin');
      return;
    }
    fetchBlogs();
  }, [router]);

  const fetchBlogs = async () => {
    try {
      const data = await getAllPosts() as ApiResponse;
      const items = data?.responseObject?.items ?? [];
      setBlogs(items);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeleting(id);
    try {
      await deleteBlogPost(id);
      setBlogs(blogs.filter((blog) => (blog._id ?? blog.id) !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Blog Posts</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center bg-snow-100 rounded shadow px-4 py-3 gap-4 animate-pulse">
              <div className="w-20 h-14 bg-snow-200 rounded" />
              <div className="flex-1">
                <div className="h-4 bg-snow-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-snow-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Blog Posts</h2>
      <div className="space-y-4">
        {blogs.length === 0 && (
          <div className="text-center text-gray-500">No blog posts found.</div>
        )}
        {blogs.map((blog) => {
          const blogId = blog._id ?? blog.id ?? '';
          if (!blogId) return null;
          return (
            <div
              key={blogId}
              className="flex items-center bg-snow-100 rounded shadow px-4 py-3 gap-4"
            >
              <div className="relative w-20 h-14">
                <Image
                  src={blog.imageUrl || '/logos/logo.png'}
                  alt={blog.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{blog.title}</h3>
                <div className="text-xs text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                className="bg-brand-p3 text-white px-3 py-1 rounded mr-2 hover:bg-brand-p3/80"
                onClick={() => handleEdit(blogId)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(blogId)}
                disabled={deleting === blogId}
              >
                {deleting === blogId ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


