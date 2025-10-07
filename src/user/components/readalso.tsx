import React from "react";
import { useFetch } from "../../hook/UseFetch";
import { getAllPosts } from "../../api/endpoints";
import { useParams, Link } from "react-router-dom";

const ReadAlso: React.FC = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch(getAllPosts, []);
  const items = (data as any)?.responseObject?.items ?? [];
  const filtered = items
    .filter((p: any) => String(p._id ?? p.id) !== String(id))
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

  return (
    <div>
      <div className="space-y-4">
        {filtered.map((blog: any) => (
          <Link
            to={`/blog/${blog._id ?? blog.id}`}
            key={(blog._id ?? blog.id) + blog.title}
            className="flex items-center cursor-pointer bg-snow-100 hover:bg-snow-200 transition-colors rounded py-3 px-4"
          >
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-32 h-20 object-cover rounded-md mr-4"
            />
            <div className="flex flex-col justify-between h-full flex-1">
              <h3 className="text-sm ">{blog.title && blog.title.length > 60 ? `${blog.title.slice(0, 50)}…` : blog.title}</h3>
              <div className="flex items-center text-xs text-gray-500 space-x-3">
                <span>{new Date(blog.createdAt ?? Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReadAlso;