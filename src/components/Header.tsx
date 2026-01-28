"use client";
import { Search, User, Menu, X } from 'lucide-react'
import  { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/api/endpoints'

interface Blog {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  imageUrl?: string;
  createdAt?: string;
}

interface ApiResponse {
  responseObject?: {
    items?: Blog[];
  };
}

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Fetch blogs when search opens
    useEffect(() => {
        if (searchOpen && blogs.length === 0) {
            setLoading(true);
            getAllPosts(1, 50)
                .then((data) => {
                    const items = (data as ApiResponse)?.responseObject?.items ?? [];
                    setBlogs(items);
                })
                .catch((err) => console.error('Failed to fetch blogs:', err))
                .finally(() => setLoading(false));
        }
    }, [searchOpen, blogs.length]);

    // Close search on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchOpen(false);
            }
        };

        if (searchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchOpen]);

    // Filter blogs based on search query
    const filteredBlogs = useMemo(() => {
        if (!searchQuery.trim()) return blogs;
        
        const query = searchQuery.toLowerCase();
        return blogs.filter((blog) => 
            blog.title.toLowerCase().includes(query)
        );
    }, [blogs, searchQuery]);

    const handleSearchClick = () => {
        setSearchOpen(!searchOpen);
        setMenuOpen(false);
    };

    const handleBlogClick = () => {
        setSearchOpen(false);
        setSearchQuery("");
    };

    return (
        <div className='sticky top-0 z-50'>
            <div className='relative flex bg-snow-100/50 backdrop-blur-md py-2 page-padding-x justify-between border-b border-brand-p3/70 items-center'>
                <Link href="/"><Image src='/logos/blacktext.png' alt='TikiAnaly Logo' width={120} height={40} className='w-30' /></Link>
                <div className='hidden md:flex text-sm text-neutral-n3 items-center gap-7'>
                <Link href='https://tikianaly.com' target="_blank" rel="noopener noreferrer" className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Main App</Link>
                <Link href='https://www.youtube.com/@TikiAnaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Youtube</Link>
                    <Link href='https://medium.com/@tikianaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Medium</Link>
                    <Link href='https://facebook.com/tikianaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Facebook</Link>
                    <Link href=' https://www.instagram.com/tikianalyapp' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Instagram</Link>
                    <Link href='https://x.com/TikiAnaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>X</Link>
                    <button 
                        onClick={handleSearchClick}
                        className='primary hover:bg-brand-p3 text-white transition-colors duration-300 cursor-pointer rounded-full p-2 '
                    >
                        <Search className='w-4 h-4' />
                    </button>
                    <Link href='/signin' className='secondary  rounded-full p-2 text-white'>
                        <User className='w-4 h-4' />
                    </Link>
                </div>

                {/* Search Dropdown - Desktop */}
                {searchOpen && (
                    <div ref={searchRef} className="absolute right-4 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
                        <div className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search blog posts..."
                                    autoFocus
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-p3"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="px-4 pb-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 mb-2 animate-pulse">
                                            <div className="w-16 h-12 bg-gray-200 rounded" />
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredBlogs.length === 0 ? (
                                <div className="px-4 pb-4 text-center text-gray-500">
                                    {searchQuery ? `No posts found matching "${searchQuery}"` : 'Start typing to search...'}
                                </div>
                            ) : (
                                <div className="px-4 pb-4">
                                    {filteredBlogs.slice(0, 40).map((blog) => (
                                        <Link
                                            key={blog._id ?? blog.id}
                                            href={`/blog/${blog.slug}`}
                                            onClick={handleBlogClick}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <div className="relative w-16 h-12 flex-shrink-0">
                                            	<Image
                                                    src={blog.imageUrl || '/logos/logo.png'}
                                                    alt={blog.title}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                    {blog.title}
                                                </h4>
                                                {blog.createdAt && (
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(blog.createdAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="md:hidden flex items-center">
                    <button
                        className="p-2 rounded-full hover:bg-brand-p3/10 transition"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div className="md:hidden bg-snow-100/95 backdrop-blur-md border-b border-brand-p3/70 px-6 py-4">
                    <div className="flex flex-col gap-4 text-neutral-n3">
                    <Link href='https://tikianaly.com' target="_blank" rel="noopener noreferrer" className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Main App</Link>
                    <Link href='https://www.youtube.com/@TikiAnaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Youtube</Link>
                    <Link href='https://medium.com/@tikianaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Medium</Link>
                    <Link href='https://facebook.com/tikianaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Facebook</Link>
                    <Link href=' https://www.instagram.com/tikianalyapp' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Instagram</Link>
                    <Link href='https://x.com/TikiAnaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>X</Link>
                        <div className="flex gap-4 mt-2">
                            <button 
                                onClick={handleSearchClick}
                                className='primary hover:bg-brand-p3 text-white transition-colors duration-300 cursor-pointer rounded-full p-2 '
                            >
                                <Search className='w-4 h-4' />
                            </button>
                            <Link href='/signin' className='secondary rounded-full p-2 text-white'>
                                <User className='w-4 h-4' />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Mobile Search Dropdown */}
            {searchOpen && (
                <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-2xl border-b border-gray-200 z-50 max-h-[80vh] overflow-hidden">
                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search blog posts..."
                                autoFocus
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-p3"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 pb-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 mb-2 animate-pulse">
                                        <div className="w-16 h-12 bg-gray-200 rounded" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredBlogs.length === 0 ? (
                            <div className="px-4 pb-4 text-center text-gray-500">
                                {searchQuery ? `No posts found matching "${searchQuery}"` : 'Start typing to search...'}
                            </div>
                        ) : (
                            <div className="px-4 pb-4">
                                {filteredBlogs.slice(0, 10).map((blog) => (
                                    <Link
                                        key={blog._id ?? blog.id}
                                        href={`/blog/${blog._id ?? blog.id}`}
                                        onClick={handleBlogClick}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <div className="relative w-16 h-12 flex-shrink-0">
                                            <Image
                                                src={blog.imageUrl || '/logos/logo.png'}
                                                alt={blog.title}
                                                fill
                                                sizes="64px"
                                                className="object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {blog.title}
                                            </h4>
                                            {blog.createdAt && (
                                                <p className="text-xs text-gray-500">
                                                    {new Date(blog.createdAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header


