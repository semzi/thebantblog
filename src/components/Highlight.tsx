"use client";
import { ArrowUpRight, Send } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useFetch } from "@/lib/hooks/useFetch";
import { getAllPosts, commentOnPost, type NewComment } from "@/lib/api/endpoints";
import Link from "next/link";
import Image from "next/image";

interface Post {
  _id?: string;
  id?: string;
  title?: string;
  imageUrl?: string;
  createdAt?: string;
  comments?: Array<{ displayName: string; message: string }>;
}

interface ApiResponse {
  responseObject?: {
    items?: Post[];
  };
}

const Highlight = () => {
  const { data, loading, error } = useFetch(() => getAllPosts(1, 20), []);
  const first = useMemo(() => (data as ApiResponse)?.responseObject?.items?.[0] ?? null, [data]);
  const [comments, setComments] = useState<Array<{ displayName: string; message: string }>>([]);
  const [displayName, setDisplayName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  useEffect(() => {
    if (Array.isArray(first?.comments)) {
      setComments(first.comments as Array<{ displayName: string; message: string }>);
    } else {
      setComments([]);
    }
  }, [first?.comments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!first?._id && !first?.id) return;
    if (isSubmittingComment) return;
    const trimmedName = displayName.trim() || "Anonymous";
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    const newComment: NewComment = { displayName: trimmedName, message: trimmedMessage };
    setIsSubmittingComment(true);
    setComments(prev => [...prev, newComment]);
    setMessage("");
    try {
      await commentOnPost(first._id ?? first.id ?? '', newComment);
    } catch {
      setComments(prev => prev.filter((_, idx) => idx !== prev.length - 1));
      setMessage(trimmedMessage);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) return (
    <div className="flex gap-5">
      <div className="flex-4 h-90 rounded shadow-xl overflow-hidden">
        <div className="w-full h-full bg-snow-200 animate-pulse" />
      </div>
      <div className="hidden lg:flex flex-2 flex-col gap-3 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 bg-snow-2 00 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
  if (error) return <p>{error}</p>;

  const formatDate = (value?: string) => {
    if (!value) return "";
    try { return new Date(value).toLocaleString('en-US', { timeZone: 'UTC' }); } catch { return ""; }
  };

  return (
    <div>
      <p className="text-neutral-n4 mb-4">Home &gt; News &gt; Football</p>
      <div className="flex gap-5">
        <Link href={first ? `/blog/${first._id ?? first.id}` : "#"} className="bg-center aspect-10/10  md:aspect-video  flex-4 rounded shadow-xl relative block" style={{ backgroundImage: first?.imageUrl ? `url(${first.imageUrl})` : "url('logos/logo.png')", backgroundSize: 'cover' }}>
          <div className="absolute bg-gradient-to-t from-black/80 to-transparent inset-0 rounded-[8px] pointer-events-none" />
          <div className="flex flex-col absolute bottom-8 w-full px-8 gap-y-2">
            <div className="flex items-center text-sm md:text-md text-white gap-2 sz-7 ">
              <Image src="/logos/logo.png" alt="TikiAnaly" width={24} height={24} className="w-6 h-6 rounded-full" />
              <span>TikiAnaly</span>
              <span>|</span>
              <span>6 mins read</span>
            </div>
            <p className="text-white text-lg   md:text-xl font-bold">
              {first?.title ?? "Latest highlight"}
            </p>
            <div className="flex justify-between">
              <div className="flex gap-3 justify-between md:justify-normal items-center">
                <span className="text-white text-xs md:text-md" suppressHydrationWarning>{first ? formatDate(first.createdAt) : ""}</span>
              </div>
              <div className="hidden md:flex animate-bounce bg-snow-100/20 px-6 py-1 rounded-full text-white gap-2 text-sm">
                Read post
                <ArrowUpRight className="w-4" />
              </div>
            </div>
          </div>
        </Link>
        <div className="hidden lg:flex overflow-y-auto hide-scrollbar flex-2 gap-3 text-sm h-90 flex-col edge-lighting block-style relative">
              <div className="absolute  left-0 right-0 bottom-0 pb-7 bg-gradient-to-t from-black/5 to-transparent w-full items-end z-2">
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

              <p className="font-[500] mb-1 flex items-center sz-4 theme-text">
                Comments <Image src="/fire.gif" alt="fire" width={20} height={20} className="w-5 ml-auto" />
              </p>
              <div className="flex flex-col gap-3">
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
    </div>
  );
};

export default Highlight;


