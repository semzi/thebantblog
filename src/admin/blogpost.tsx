import React, { useState } from "react";

// Dummy data for demonstration. Replace with your API data.
const initialBlogs = [
  {
    id: "1",
    title: "Super Eagles wins the World Cup",
    imageUrl: "https://tikianaly.vercel.app/logos/whitelogo.png",
    createdAt: "2025-10-01T11:52:23.423Z",
  },
  {
    id: "2",
    title: "A test post with Admin authToken",
    imageUrl: "https://img.com/image.png",
    createdAt: "2025-09-28T21:18:09.086Z",
  },
];

const BlogPostList: React.FC = () => {
  const [blogs, setBlogs] = useState(initialBlogs);

  const handleDelete = (id: string) => {
    // Replace with API call if needed
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  const handleEdit = (id: string) => {
    // Navigate to edit page or open modal
    alert(`Edit blog with id: ${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Blog Posts</h2>
      <div className="space-y-4">
        {blogs.length === 0 && (
          <div className="text-center text-gray-500">No blog posts found.</div>
        )}
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="flex items-center bg-snow-100 rounded shadow px-4 py-3 gap-4"
          >
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-20 h-14 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{blog.title}</h3>
              <div className="text-xs text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button
              className="bg-brand-p3 text-white px-3 py-1 rounded mr-2 hover:bg-brand-p3/80"
              onClick={() => handleEdit(blog.id)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => handleDelete(blog.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPostList;