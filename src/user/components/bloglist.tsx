
import  { getAllPosts } from "../../api/endpoints";
import { useFetch } from "../../hook/UseFetch";



const BlogList: React.FC = () => {
  const { data, loading, error } = useFetch(getAllPosts, []);
  const items = (data as any)?.responseObject?.items ?? [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="space-y-3">
        {items.map(function (blog: any) {
          return (
            <a
              href={`/blog/${blog._id ?? blog.id}`}
              key={(blog._id ?? blog.id) + blog.title}
              className="flex  items-center cursor-pointer bg-snow-100 hover:bg-snow-200 transition-colors rounded shadow py-3 px-4"
            >
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="aspect-video h-20 object-cover rounded-md mr-3" />
              <div className="flex flex-col justify-between h-20 flex-1">
                <h3 className="text-sm md:text-base md:font-semibold">{blog.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{blog.time ?? new Date(blog.createdAt ?? Date.now()).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{(blog.views ?? 0).toLocaleString()} views</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
           className="px-4 py-2 rounded-l bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
          // onClick={() => setPage((p) => Math.max(1, p - 1))}
          // disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-4 py-2 bg-white  text-gray-700">
          Page 1 of 10
        </span>
        <button
          className="px-4 py-2 rounded-r bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
          // onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          // disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogList;