import { Search, User, Menu } from 'lucide-react'
import  { useState } from 'react'

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className='sticky top-0 z-5'>
            <div className='flex bg-snow-100/50 backdrop-blur-md py-2 page-padding-x justify-between border-b border-brand-p3/70 items-center'>
                <a href="/"><img src='/logos/blacktext.png'  alt='logo' className='w-30' /></a>
                {/* Desktop Nav */}
                <div className='hidden md:flex text-sm text-neutral-n3 items-center gap-7'>
                    <button className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Home</button>
                    <button className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Blog</button>
                    <button className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>News</button>
                    <button className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Transfer News</button>
                    <button className='primary hover:bg-brand-p3 text-white transition-colors duration-300 cursor-pointer rounded-full p-2 '>
                        <Search className='w-4 h-4' />
                    </button>
                    <button className='secondary  rounded-full p-2 text-white'>
                        <User className='w-4 h-4' />
                    </button>
                </div>
                {/* Mobile Nav Button */}
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
            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-snow-100/95 backdrop-blur-md border-b border-brand-p3/70 px-6 py-4">
                    <div className="flex flex-col gap-4 text-neutral-n3">
                        <button className='text-left hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Home</button>
                        <button className='text-left hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Blog</button>
                        <button className='text-left hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>News</button>
                        <button className='text-left hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Transfer News</button>
                        <div className="flex gap-4 mt-2">
                            <button className='primary hover:bg-brand-p3 text-white transition-colors duration-300 cursor-pointer rounded-full p-2 '>
                                <Search className='w-4 h-4' />
                            </button>
                            <button className='secondary rounded-full p-2 text-white'>
                                <User className='w-4 h-4' />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header