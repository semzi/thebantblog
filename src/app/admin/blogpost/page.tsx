"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAllPosts, deleteBlogPost } from "@/lib/api/endpoints";
import Image from "next/image";
import { Search, X } from "lucide-react";

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
    totalPages?: number;
    currentPage?: number;
    totalItems?: number;
  };
}

export default function BlogPostListPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 40;

  // Filter blogs based on search query
  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogs;
    
    const query = searchQuery.toLowerCase();
    return blogs.filter((blog) => 
      blog.title.toLowerCase().includes(query) ||
      new Date(blog.createdAt).toLocaleDateString().includes(query)
    );
  }, [blogs, searchQuery]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/signin');
      return;
    }
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, page]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllPosts(page, limit) as ApiResponse;
      const items = data?.responseObject?.items ?? [];
      setBlogs(items);
      setTotalPages(data?.responseObject?.totalPages ?? 1);
      setCurrentPage(data?.responseObject?.currentPage ?? page);
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <div className="text-sm text-gray-500">
          {filteredBlogs.length} of {blogs.length} posts
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or date..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-p3 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filteredBlogs.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-8">
            {searchQuery ? `No posts found matching "${searchQuery}"` : 'No blog posts found.'}
          </div>
        )}
        {filteredBlogs.map((blog) => {
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
      
      {/* Pagination - only show if not searching */}
      {blogs.length > 0 && !searchQuery && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || loading}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-white border rounded text-gray-700 flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || loading}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}


