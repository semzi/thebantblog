"use client";
import { Search, User, Menu } from 'lucide-react'
import  { useState } from 'react'
import Link from 'next/link'

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className='sticky top-0 z-5'>
            <div className='flex bg-snow-100/50 backdrop-blur-md py-2 page-padding-x justify-between border-b border-brand-p3/70 items-center'>
                <Link href="/"><img src='/logos/blacktext.png'  alt='logo' className='w-30' /></Link>
                <div className='hidden md:flex text-sm text-neutral-n3 items-center gap-7'>
                <Link href='https://www.youtube.com/@TikiAnaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Youtube</Link>
                    <Link href='https://medium.com/@tikianaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Medium</Link>
                    <Link href='https://facebook.com/tikianaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Facebook</Link>
                    <Link href=' https://www.instagram.com/tikianalyapp' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Instagram</Link>
                    <Link href='https://x.com/TikiAnaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>X</Link>
                    <button className='primary hover:bg-brand-p3 text-white transition-colors duration-300 cursor-pointer rounded-full p-2 '>
                        <Search className='w-4 h-4' />
                    </button>
                    <Link href='/signin' className='secondary  rounded-full p-2 text-white'>
                        <User className='w-4 h-4' />
                    </Link>
                </div>
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
                    <Link href='https://www.youtube.com/@TikiAnaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Youtube</Link>
                    <Link href='https://medium.com/@tikianaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Medium</Link>
                    <Link href='https://facebook.com/tikianaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Facebook</Link>
                    <Link href=' https://www.instagram.com/tikianalyapp' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Instagram</Link>
                    <Link href='https://x.com/TikiAnaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>X</Link>
                        <div className="flex gap-4 mt-2">
                            <button className='primary hover:bg-brand-p3 text-white transition-colors duration-300 cursor-pointer rounded-full p-2 '>
                                <Search className='w-4 h-4' />
                            </button>
                            <Link href='/signin' className='secondary rounded-full p-2 text-white'>
                                <User className='w-4 h-4' />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header


