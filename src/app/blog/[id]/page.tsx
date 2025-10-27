"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostById, reactToPost, commentOnPost, type ReactionType, type NewComment } from "@/lib/api/endpoints";
import { useFetch } from "@/lib/hooks/useFetch";
import { Link as LinkIcon, Send } from "lucide-react";
import Link from "next/link"; 
import { marked } from "marked";
import ReadAlso from "@/components/ReadAlso";
import { notFound } from "next/navigation";
import Image from "next/image";

const reactionConfig = [
  { key: "like", icon: "👍", label: "Like" },
  { key: "love", icon: "❤️", label: "Love" },
  { key: "clap", icon: "👏", label: "Clap" },
] as const;

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

export default function BlogPostPage() {
  const routeParams = useParams();
  const id = String(routeParams?.id ?? "");
  const [selected, setSelected] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({ like: 0, love: 0, clap: 0 });
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [hasReacted, setHasReacted] = useState<boolean>(false);
  const [comments, setComments] = useState<Array<{ displayName: string; message: string }>>([]);
  const [displayName, setDisplayName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  const { data, loading, error } = useFetch(() => getPostById(id), [id]);
  const post = (data as ApiResponse)?.responseObject ?? null;

  useEffect(() => {
    if (post?.reactions) {
      setReactionCounts({
        like: post.reactions.like ?? 0,
        love: post.reactions.love ?? 0,
        clap: post.reactions.clap ?? 0,
      });
    }
    if (Array.isArray(post?.comments)) {
      setComments(post.comments as Array<{ displayName: string; message: string }>);
    } else {
      setComments([]);
    }
  }, [post?.reactions, post?.comments]);

  useEffect(() => {
    if (!id) return;
    const key = `post:${id}:reaction`;
    const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    if (stored) {
      setSelected(stored);
      setHasReacted(true);
    } else {
      setSelected(null);
      setHasReacted(false);
    }
  }, [id]);

  const handleReact = async (type: ReactionType) => {
    if (!id || isReacting || hasReacted) return;
    setIsReacting(true);
    setReactionCounts(prev => ({ ...prev, [type]: (prev[type] ?? 0) + 1 }));
    setSelected(type);
    try {
      await reactToPost(id, type);
      const key = `post:${id}:reaction`;
      if (typeof window !== 'undefined') localStorage.setItem(key, type);
      setHasReacted(true);
    } catch {
      setReactionCounts(prev => ({ ...prev, [type]: Math.max(0, (prev[type] ?? 1) - 1) }));
      setSelected(null);
    } finally {
      setIsReacting(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || isSubmittingComment) return;
    const trimmedName = displayName.trim() || "Anonymous";
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    const newComment: NewComment = { displayName: trimmedName, message: trimmedMessage };
    setIsSubmittingComment(true);
    setComments(prev => [...prev, newComment]);
    setMessage("");
    try {
      await commentOnPost(id, newComment);
    } catch {
      setComments(prev => prev.filter((_, idx) => idx !== prev.length - 1));
      setMessage(trimmedMessage);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) return (
      <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-12 py-8 max-w-7xl mx-auto">
        <div className="w-full md:w-7/10 lg:w-7/10">
          <div className="h-6 w-2/3 bg-snow-200 rounded mb-3 animate-pulse" />
          <div className="flex items-center gap-3 mb-4">
            <div className="h-3 w-24 bg-snow-200 rounded animate-pulse" />
            <div className="h-3 w-3 bg-snow-200 rounded animate-pulse" />
            <div className="h-3 w-28 bg-snow-200 rounded animate-pulse" />
          </div>
          <div className="w-full aspect-video bg-snow-200 rounded-lg mb-6 animate-pulse" />
          <div className="space-y-3 mb-6">
            <div className="h-4 w-full bg-snow-200 rounded animate-pulse" />
            <div className="h-4 w-11/12 bg-snow-200 rounded animate-pulse" />
            <div className="h-4 w-10/12 bg-snow-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-6 mt-8 mb-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-16 bg-snow-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        <div className="w-full lg:w-3/10">
          <div className="h-5 w-24 bg-snow-200 rounded mb-4 animate-pulse" />
          <div className="h-80 w-full bg-snow-200 rounded animate-pulse" />
        </div>
      </div>
  );
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Unable to Load Blog Post</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/" 
            className="inline-block bg-brand-p1 text-white px-6 py-3 rounded-lg hover:bg-brand-p2 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return notFound();
  }
  const formatDate = (value?: string) => {
    if (!value) return "";
    try { return new Date(value).toLocaleString('en-US', { timeZone: 'UTC' }); } catch { return ""; }
  };

  return (
      <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-12 py-8 max-w-7xl mx-auto">
        <div className="w-full md:w-7/10 lg:w-7/10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {post.title}
          </h1>
          <div className="flex flex-row itemms-left justify-  md:justify-start md:items-center text-sm text-gray-500 mb-4 gap-3">
            <span>By {post.writer ?? "Tikianaly"}</span>
            <span className="hidden md:block">•</span>
              <span suppressHydrationWarning>{formatDate(post.createdAt)}</span>
          </div>
          <div className="relative w-full aspect-video mb-6">
            <Image
              src={post?.imageUrl || '/logos/logo.png'}
              alt={post.title ?? 'Blog post'}
              fill
              className="object-cover rounded-lg"
            />
          </div>
            <div
            className="richtext max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: String(marked(post.content ?? ''))
                .replace(/<a\s+[^>]*href\s*=\s*["'][^"']*["'][^>]*>(.*?)<\/a>/gi, '$1')
                .replace(/<a\s+[^>]*>(.*?)<\/a>/gi, '$1')
            }}
            />
          <div className="flex flex-wrap gap-2 mb-10">
            {(post.hashtags ?? []).map((tag: string) => (
              <span key={tag} className="bg-brand-p3/10 text-brand-p1 px-3 py-1 rounded-full text-xs font-medium">#{tag}</span>
            ))}
          </div>
          <div className="flex gap-6 mt-8 mb-2">
            {reactionConfig.map((cfg) => {
              const count = (reactionCounts?.[cfg.key] ?? 0) as number;
              const isSelected = selected === cfg.key;
              return (
              <button
                  key={cfg.key}
                  className={`flex cursor-pointer flex-col items-center px-3 py-1 group focus:outline-none transition-transform duration-200 ${isSelected ? "bg-brand-p3/20 rounded-full scale-110" : ""}`}
                  aria-label={cfg.label}
                type="button"
                  disabled={isReacting || hasReacted}
                  onClick={() => handleReact(cfg.key as ReactionType)}
              >
                  <span className="flex items-center gap-2 text-neutral-500">
                    {cfg.icon}
                    <span className="text-sm">{count}</span>
                  </span>
              </button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-col-reverse overflow-y-auto gap-3 text-sm h-90 edge-lighting pb-0 px-0 block-style ">
              <div className=" pb-7 bg-gradient-to-t from-black/5 to-transparent w-full items-end z-2">
                <form onSubmit={handleSubmitComment} className="flex gap-2 w-full px-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="rounded-full  outline-none py-2 px-5 text-black bg-snow-200 focus:bg-snow-100 w-2/5"
                  />
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="rounded-full  outline-none py-2 px-5 text-black bg-snow-200 focus:bg-snow-100 w-full"
                  />
                  <button disabled={isSubmittingComment} className='secondary rounded-full py-2 px-4 text-white'>
                        <Send className='w-4 h-4 ' />
                    </button>
                </form>
              </div>

              <div className="flex mx-5 h-full overflow-y-auto hide-scrollbar flex-col gap-3">
              <p className="font-[500] mb-1 flex items-center sz-4 theme-text">
                Comments 
              </p>
                {comments.length === 0 ? (
                  <p className="text-neutral-m6 text-xs">Be the first to comment.</p>
                ) : (
                  comments.map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=static-seed-${i}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`} alt={c.displayName} width={20} height={20} className="h-5 w-5 rounded-full" />
                      <div className="block">
                        <p className="text-neutral-m6 text-xs">{c.displayName}</p>
                        <p>{c.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
          </div>
        </div>
        <div className="w-full lg:w-3/10">
          <p className="mb-8">Also Read</p>
          <div className="bg-snow-100/30 rounded-lg h-full ">
            <ReadAlso currentId={id} />
          </div>
        </div>
      </div>
  );
}


