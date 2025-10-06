import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Link } from "react-router-dom";
import { BookAIcon } from "lucide-react";

const dashboardStats = {
  blogs: 12,
  comments: 56,
  reactions: 102,
};

const Dashboard: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const blogPost = {
      title,
      content,
      hashtags,
      image,
    };
    // Submit blogPost to API here
    console.log(blogPost);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Dashboard Stats */}
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
        <Link to={"/admin/blogpost"} className="secondary rounded-lg shadow p-4 flex flex-col items-center justify-center transition-colors">
                <span className="text-2xl text-white flex items-center gap-3 font-bold"> <BookAIcon />  Posts</span>
        </Link>
      </div>

      {/* Blog Post Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        <h2 className="text-lg font-semibold mb-2">Create Blog Post</h2>
        {/* Title */}
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
        {/* Image Uploader */}
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            className="block"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 aspect-video h-32 rounded object-cover"
            />
          )}
        </div>
        {/* TinyMCE Editor */}
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
        {/* Hashtags */}
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
        {/* Submit */}
        <button
          type="submit"
          className="secondary text-white px-6 py-2 rounded hover:bg-brand-p3/90"
        >
          Post Blog
        </button>
      </form>
    </div>
  );
};

export default Dashboard;