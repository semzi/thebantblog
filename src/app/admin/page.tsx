"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createBlogPost, getDashboardStats } from "@/lib/api/endpoints";
import Link from "next/link";
import { BookAIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface DashboardStats {
  blogs: number;
  comments: number;
  reactions: number;
}

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/signin');
      return;
    }
    // Validate token by making a test request
    const validateToken = async () => {
      try {
        // You could add a token validation endpoint here
        // For now, we'll just check if token exists
        if (!token) {
          localStorage.removeItem('token');
          router.replace('/signin');
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        router.replace('/signin');
      }
    };
    validateToken();
    fetchDashboardStats();
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getDashboardStats();
      // Handle the API response format: { success: true, responseObject: { totalPost: 19486, totalComment: 22 } }
      if (response?.success && response?.responseObject) {
        setDashboardStats({
          blogs: response.responseObject.totalPost || 0,
          comments: response.responseObject.totalComment || 0,
          reactions: 0, // Not provided by API, keeping as 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Keep default values (0) on error
    } finally {
      setStatsLoading(false);
    }
  };
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' } | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    blogs: 0,
    comments: 0,
    reactions: 0,
  });
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  const handleAddHashtag = () => {
    const tag = hashtagInput.trim();
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setHashtagInput("");
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        imageUrl: imageUrl.trim() || "https://via.placeholder.com/800x400",
        content,
        hashTag: hashtags.join(", "),
        authToken: "Nigeria@20",
      };
      const res = await createBlogPost(payload);
      setToast({ message: 'Post created successfully', kind: 'success' });
      setTitle("");
      setContent("");
      setHashtags([]);
      setHashtagInput("");
      setImagePreview(null);
      setImageUrl("");
      router.push(`/blog/${res?.responseObject.slug}`);
      // Refresh dashboard stats after creating a new post
      fetchDashboardStats();
    } catch (err: unknown) {
      console.error('Create post error:', err);
      let errorMessage = 'Failed to create post';
      if (err instanceof Error) {
        errorMessage = err.message;
        // Handle specific error cases
        if (err.message.includes('401')) {
          errorMessage = 'Authentication failed. Please sign in again.';
          localStorage.removeItem('token');
          router.replace('/signin');
        } else if (err.message.includes('400')) {
          errorMessage = 'Invalid data provided. Please check your inputs.';
        }
      }
      setToast({ message: errorMessage, kind: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {Object.entries(dashboardStats).map(([key, value]) => (
          <div
            key={key}
            className="bg-snow-100 rounded-lg shadow p-4 flex flex-col items-center"
          >
            <span className="text-2xl font-bold">
              {statsLoading ? (
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              ) : (
                value
              )}
            </span>
            <span className="text-xs text-gray-500 capitalize">{key}</span>
          </div>
        ))}
        <Link href={"/admin/blogpost"} className="secondary rounded-lg shadow p-4 flex flex-col items-center justify-center transition-colors">
                <span className="text-2xl text-white flex items-center gap-3 font-bold"> <BookAIcon />  Posts</span>
        </Link>
        <a 
          href="https://imagekit.io/dashboard/media-library" 
          target="_blank" 
          rel="noopener noreferrer"
          className="primary rounded-lg shadow p-4 flex flex-col items-center justify-center transition-colors hover:from-blue-600 hover:to-purple-700"
        >
          <span className="text-2xl text-white flex items-center gap-3 font-bold">
            <ImageIcon /> Image
          </span>
        </a>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-lg font-semibold mb-2">Create Blog Post</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-brand-p3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring focus:border-brand-p3"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <label className="block text-sm font-medium mb-1">Or Upload Cover Image (preview only)</label>
          <input
            type="file"
            accept="image/*"
            className="block"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="relative mt-2 aspect-video h-32">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="rounded object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <div className="border rounded overflow-hidden">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || "")}
              height={250}
              data-color-mode="light"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hashtags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring focus:border-brand-p3"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              placeholder="Add hashtag"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddHashtag();
                }
              }}
            />
            <button
              type="button"
              className="primary cursor-pointer text-white px-3 py-2 rounded"
              onClick={handleAddHashtag}
            >
              Add
            </button>
          </div>
           <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="bg-brand-p1/90 text-white px-3 py-1 rounded-full text-xs flex items-center"
              >
                #{tag}
                <button
                  type="button"
                  className="ml-2 text-white hover:text-red-700"
                  onClick={() => handleRemoveHashtag(tag)}
                  aria-label="Remove hashtag"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        <button type="submit" disabled={submitting} className="secondary text-white px-6 py-2 rounded hover:bg-brand-p3/90">
          {submitting ? 'Posting…' : 'Post Blog'}
        </button>
      </form>
      {toast && (
        <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded text-white shadow-lg ${toast.kind === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}


