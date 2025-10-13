import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function BlogPostLayout({ children }: Props) {
  return children;
}

interface Post {
  title?: string;
  imageUrl?: string;
}

interface ApiResponse {
  responseObject?: Post;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const res = await fetch(`https://tikianaly-blog.onrender.com/api/v1/blogpost/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('failed');
    const data = await res.json() as ApiResponse;
    const post = data?.responseObject ?? null;
    const title = post?.title ?? "Blog post";
    const description = post?.title ?? "Read the latest from TikiAnaly";
    const imageUrl = post?.imageUrl ?? undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        images: imageUrl ? [{ url: imageUrl }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
      alternates: { canonical: `/blog/${id}` },
    };
  } catch {
    return { title: "Blog post", description: "Read the latest from TikiAnaly" };
  }
}


