"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createBlogPost, getAllPosts, getDashboardStats } from "@/lib/api/endpoints";
import Link from "next/link";
import { BookAIcon, ImageIcon, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface DashboardStats {
  blogs: number;
  comments: number;
  reactions: number;
}

interface Blog {
  _id?: string;
  id?: string;
  title?: string;
  imageUrl?: string;
  createdAt?: string;
}

interface PostsApiResponse {
  responseObject?: {
    items?: Blog[];
  };
}

export default function AdminPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [_, setImageData] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' } | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    blogs: 0,
    comments: 0,
    reactions: 0,
  });
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  const PINNED_POST_STORAGE_KEY = "pinnedPostId";
  const PINNED_POST_UPDATED_EVENT = "pinned-post-updated";
  const [pinSearchQuery, setPinSearchQuery] = useState<string>("");
  const [pinPosts, setPinPosts] = useState<Blog[]>([]);
  const [pinLoading, setPinLoading] = useState<boolean>(false);
  const [pinnedPostId, setPinnedPostId] = useState<string>("");

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/signin');
      return;
    }
    setPinnedPostId((localStorage.getItem(PINNED_POST_STORAGE_KEY) ?? "").trim());
    const validateToken = async () => {
      try {
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
    fetchPinPosts();
  }, [router]);

  const fetchPinPosts = async () => {
    try {
      setPinLoading(true);
      const data = await getAllPosts(1, 80) as PostsApiResponse;
      setPinPosts(data?.responseObject?.items ?? []);
    } catch (error) {
      console.error('Failed to fetch posts for pinning:', error);
    } finally {
      setPinLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getDashboardStats();
      if (response?.success && response?.responseObject) {
        setDashboardStats({
          blogs: response.responseObject.totalPost || 0,
          comments: response.responseObject.totalComment || 0,
          reactions: 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handlePinPost = (id: string) => {
    if (typeof window === 'undefined') return;
    const nextId = (id ?? "").trim();
    if (!nextId) return;
    localStorage.setItem(PINNED_POST_STORAGE_KEY, nextId);
    window.dispatchEvent(new Event(PINNED_POST_UPDATED_EVENT));
    setPinnedPostId(nextId);
    setToast({ message: 'Pinned post updated', kind: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleClearPinnedPost = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PINNED_POST_STORAGE_KEY);
    window.dispatchEvent(new Event(PINNED_POST_UPDATED_EVENT));
    setPinnedPostId("");
    setToast({ message: 'Pinned post cleared (Highlight will use latest post)', kind: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

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

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        imageUrl: imageUrl.trim() || '',
        content,
        hashTag: hashtags.join(", "),
        authToken: "Nigeria@20",
      };
      const res = await createBlogPost(payload);
      console.log(res);
      setToast({ message: 'Post created successfully', kind: 'success' });
      setTitle("");
      setContent("");
      setHashtags([]);
      setHashtagInput("");
      setImagePreview(null);
      setImageUrl("");
      setImageData("");
      router.push(`/blog/${res?.responseObject.slug}`);
      fetchDashboardStats();
    } catch (err: unknown) {
      console.error('Create post error:', err);
      let errorMessage = 'Failed to create post';
      if (err instanceof Error) {
        errorMessage = err.message;
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
          <span className="text-2xl text-white flex items-center gap-3 font-bold"> 
            <BookAIcon />  Posts
          </span>
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

      <details className="bg-white rounded-lg shadow p-6 mb-8" open>
        <summary className="cursor-pointer select-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">Pinned Highlight Post</h2>
              <p className="text-sm text-gray-500">Search for a post and pin it to the homepage highlight.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-xs text-gray-500">Current pinned id</div>
              <div className="text-xs font-mono break-all max-w-[220px] text-right">{pinnedPostId || '—'}</div>
            </div>
          </div>
        </summary>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleClearPinnedPost}
            className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
          >
            Clear pinned
          </button>
        </div>

        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={pinSearchQuery}
            onChange={(e) => setPinSearchQuery(e.target.value)}
            placeholder="Search posts by title..."
            className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-p3 focus:border-transparent transition-all"
          />
          {pinSearchQuery && (
            <button
              type="button"
              onClick={() => setPinSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {pinLoading ? (
            <div className="text-sm text-gray-500">Loading posts…</div>
          ) : (
            (pinPosts ?? [])
              .filter((p) => {
                const q = pinSearchQuery.trim().toLowerCase();
                if (!q) return true;
                return String(p.title ?? "").toLowerCase().includes(q);
              })
              .slice(0, 10)
              .map((p) => {
                const id = (p._id ?? p.id ?? "").trim();
                if (!id) return null;
                const isPinned = id === pinnedPostId;
                return (
                  <div key={id} className="flex items-center bg-snow-100 rounded shadow px-4 py-3 gap-4">
                    <div className="relative w-14 h-10 flex-shrink-0">
                      <Image
                        src={p.imageUrl || '/logos/logo.png'}
                        alt={p.title ?? 'Post'}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{p.title ?? 'Untitled'}</div>
                      <div className="text-xs text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}</div>
                      <div className="text-[10px] text-gray-400 font-mono truncate">{id}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePinPost(id)}
                      className={`px-3 py-1 rounded text-white ${isPinned ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-p3 hover:bg-brand-p3/80'}`}
                    >
                      {isPinned ? 'Pinned' : 'Pin'}
                    </button>
                  </div>
                );
              })
          )}
        </div>
      </details>

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