"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { getPostById, updateBlogPost } from "@/lib/api/endpoints";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Post {
  title?: string;
  content?: string;
  imageUrl?: string;
  hashtags?: string[];
}

interface ApiResponse {
  responseObject?: Post;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id ?? "");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/signin');
      return;
    }
    if (!id) return;
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);

  const fetchPost = async () => {
    try {
      const data = await getPostById(id) as ApiResponse;
      const post = data?.responseObject ?? null;
      if (!post) {
        setToast({ message: 'Post not found', kind: 'error' });
        setTimeout(() => router.push('/admin/blogpost'), 2000);
        return;
      }
      setTitle(post.title ?? "");
      setContent(post.content ?? "");
      setImageUrl(post.imageUrl ?? "");
      const tags = post.hashtags ?? [];
      setHashtags(Array.isArray(tags) ? tags : []);
    } catch (err) {
      console.error('Failed to fetch post:', err);
      setToast({ message: 'Failed to load post', kind: 'error' });
    } finally {
      setLoading(false);
    }
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
      await updateBlogPost(id, payload);
      setToast({ message: 'Post updated successfully', kind: 'success' });
      setTimeout(() => router.push('/admin/blogpost'), 1500);
    } catch (err: unknown) {
      console.error('Update post error:', err);
      let errorMessage = 'Failed to update post';
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="h-8 w-48 bg-snow-200 rounded mb-6 animate-pulse" />
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="h-10 bg-snow-200 rounded animate-pulse" />
          <div className="h-10 bg-snow-200 rounded animate-pulse" />
          <div className="h-64 bg-snow-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Edit Blog Post</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
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
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-brand-p3"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
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
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/blogpost')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="secondary text-white px-6 py-2 rounded hover:bg-brand-p3/90"
          >
            {submitting ? 'Updating…' : 'Update Post'}
          </button>
        </div>
      </form>
      {toast && (
        <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded text-white shadow-lg ${toast.kind === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

