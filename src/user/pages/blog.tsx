import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReadAlso from "../components/readalso";
import { getPostById, reactToPost, commentOnPost, type ReactionType, type NewComment } from "../../api/endpoints";
import { useFetch } from "../../hook/UseFetch";
import { Send } from "lucide-react";

// Static fallback sample removed; page now fetches by id

const reactionConfig = [
  { key: "like", icon: "👍", label: "Like" },
  { key: "love", icon: "❤️", label: "Love" },
  { key: "clap", icon: "👏", label: "Clap" },
] as const;

const BlogReadPage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({ like: 0, love: 0, clap: 0 });
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [hasReacted, setHasReacted] = useState<boolean>(false);
  const [comments, setComments] = useState<Array<{ displayName: string; message: string }>>([]);
  const [displayName, setDisplayName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
  const { id } = useParams();

  const { data, loading, error } = useFetch(() => getPostById(id), [id]);
  const post = (data as any)?.responseObject ?? null;

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
  }, [post?.reactions]);

  // Initialize selection from localStorage to enforce one reaction per user per post (client-side)
  useEffect(() => {
    if (!id) return;
    const key = `post:${id}:reaction`;
    const stored = localStorage.getItem(key);
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

    // optimistic update
    setReactionCounts(prev => ({ ...prev, [type]: (prev[type] ?? 0) + 1 }));
    setSelected(type);
    try {
      await reactToPost(id, type);
      // persist choice so user cannot react again on this device/browser
      const key = `post:${id}:reaction`;
      localStorage.setItem(key, type);
      setHasReacted(true);
    } catch (e) {
      // revert on failure
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
    // optimistic add
    setComments(prev => [...prev, newComment]);
    setMessage("");
    try {
      await commentOnPost(id, newComment);
    } catch (err) {
      // revert on failure
      setComments(prev => prev.filter((_, idx) => idx !== prev.length - 1));
      setMessage(trimmedMessage);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
  if (!post) return <p>Post not found.</p>;
    return (
      <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-12 py-8 max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="w-full md:w-7/10 lg:w-7/10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {post.title}
          </h1>
          <div className="flex flex-row itemms-left justify-  md:justify-start md:items-center text-sm text-gray-500 mb-4 gap-3">
            <span>By {post.writer ?? "Tikianaly"}</span>
            <span className="hidden md:block">•</span>
            <span>{new Date(post.createdAt ?? Date.now()).toLocaleString()}</span>
          </div>
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-lg mb-6"
          />
          <div className="text-base text-gray-800 mb-6 leading-relaxed">
            {post.content}
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            {(post.hashtags ?? []).map((tag: string) => (
              <span key={tag} className="bg-brand-p3/10 text-brand-p1 px-3 py-1 rounded-full text-xs font-medium">#{tag}</span>
            ))}
          </div>
          {/* Reactions */}
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
              {/* Overlay gradient with text */}
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
                Comments <img src="/fire.gif" className="w-5 ml-auto" alt="" />
              </p>
                {comments.length === 0 ? (
                  <p className="text-neutral-m6 text-xs">Be the first to comment.</p>
                ) : (
                  comments.map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`} alt="" className="h-5 w-5 rounded-full" />
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
        {/* Side Division */}
        <div className="w-full lg:w-3/10">
          <p className="mb-8">Also Read</p>
          <div className="bg-snow-100/30 rounded-lg h-full ">
            <ReadAlso />
          </div>
        </div>
      </div>
    );
};

export default BlogReadPage;
