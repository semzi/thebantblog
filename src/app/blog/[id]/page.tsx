import { notFound } from "next/navigation";

import BlogPostClient from "./BlogPostClient";
import { getPostById, getPostBySlug } from "@/lib/api/endpoints";

interface Post {
  title?: string;
  imageUrl?: string;
  content?: string;
  writer?: string;
  createdAt?: string;
  hashtags?: string[];
  reactions?: {
    like?: number;
    love?: number;
    clap?: number;
  };
  comments?: Array<{ displayName: string; message: string }>;
}

interface ApiResponse {
  responseObject?: Post;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    notFound();
  }

  let initialPost: Post | null = null;
  let error: string | null = null;

  try {
    const data = (await getPostById(id)) as ApiResponse;
    initialPost = data?.responseObject ?? null;
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "Failed to load blog post";
  }

  if (!initialPost && !error) {
    notFound();
  }

  return <BlogPostClient id={id} initialPost={initialPost} initialError={error} />;
}

