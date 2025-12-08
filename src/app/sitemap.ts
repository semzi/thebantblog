export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";

interface BlogPost {
  _id?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  responseObject?: {
    items?: BlogPost[];
    totalPages?: number;
    currentPage?: number;
    totalItems?: number;
  };
}

async function getAllBlogPostIds(): Promise<string[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://tikianaly-blog-tmv5.onrender.com/api/v1";

    const allPosts: string[] = [];
    let page = 1;
    const limit = 100;

    while (true) {
      const response = await fetch(
        `${baseUrl}/blogpost?page=${page}&limit=${limit}`,
        { cache: "no-store" }
      );

      if (!response.ok) break;

      const data: ApiResponse = await response.json();
      const items = data?.responseObject?.items || [];
      const totalPages = data?.responseObject?.totalPages || 1;

      if (items.length === 0) break;

      items.forEach((post) => {
        const postId = post._id || post.id;
        if (postId) allPosts.push(postId);
      });

      if (page >= totalPages) break;
      page++;
    }

    return allPosts;
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://blog.tikianaly.com";

  const postIds = await getAllBlogPostIds();

  const blogEntries: MetadataRoute.Sitemap = postIds.map((id) => ({
    url: `${baseUrl}/blog/${id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  return [...staticPages, ...blogEntries];
}