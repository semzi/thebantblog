import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-brand-p1 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn&apos;t find the blog post you&apos;re looking for. 
          It may have been removed or the link might be incorrect.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/"
            className="inline-block bg-brand-p1 text-white px-6 py-3 rounded-lg hover:bg-brand-p2 transition-colors"
          >
            Back to Home
          </Link>
          <Link 
            href="/#blog"
            className="inline-block border-2 border-brand-p1 text-brand-p1 px-6 py-3 rounded-lg hover:bg-brand-p1 hover:text-white transition-colors"
          >
            View All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}

