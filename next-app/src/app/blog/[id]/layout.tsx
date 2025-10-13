import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: { id: string };
};

export default function BlogPostLayout({ children }: Props) {
  return children;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`https://tikianaly-blog.onrender.com/api/v1/blogpost/${params.id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('failed');
    const data = await res.json();
    const post: any = (data as any)?.responseObject ?? null;
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
      alternates: { canonical: `/blog/${params.id}` },
    };
  } catch (_) {
    return { title: "Blog post", description: "Read the latest from TikiAnaly" };
  }
}


