"use client";
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { createBlogPost } from "@/lib/api/endpoints";
import Link from "next/link";
import { BookAIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const dashboardStats = {
  blogs: 12,
  comments: 56,
  reactions: 102,
};

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) router.replace('/signin');
  }, [router]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' } | null>(null);

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
      console.log('Sending payload:', payload);
      await createBlogPost(payload);
      setToast({ message: 'Post created successfully', kind: 'success' });
      setTitle("");
      setContent("");
      setHashtags([]);
      setHashtagInput("");
      setImagePreview(null);
      setImageUrl("");
    } catch (err: unknown) {
      setToast({ message: err instanceof Error ? err.message : 'Failed to create post', kind: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {Object.entries(dashboardStats).map(([key, value]) => (
          <div
            key={key}
            className="bg-snow-100 rounded-lg shadow p-4 flex flex-col items-center"
          >
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-xs text-gray-500 capitalize">{key}</span>
          </div>
        ))}
        <Link href={"/admin/blogpost"} className="secondary rounded-lg shadow p-4 flex flex-col items-center justify-center transition-colors">
                <span className="text-2xl text-white flex items-center gap-3 font-bold"> <BookAIcon />  Posts</span>
        </Link>
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
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <Editor
            apiKey='el7908i5y3hmdh73qqfb0oi4xjp9qnqalzgoqk8d43efanx4'
            value={content}
            init={{
              height: 250,
              menubar: false,
              plugins: [
                'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
              ],
              toolbar:
                "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
            }}
            onEditorChange={(newValue) => setContent(newValue)}
          />
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


