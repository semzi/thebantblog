"use client";
import { Facebook, InstagramIcon, X } from 'lucide-react';
import  { useMemo, useState } from 'react'
import { joinWaitlist } from '@/lib/api/endpoints'
import Link from 'next/link'

const useRandomProfilePictures = (count: number) => {
    const profilePictures = useMemo(() => {
        const pictures: string[] = [];
        for (let i = 0; i < count; i++) {
            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=static-seed-${i}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
            pictures.push(avatarUrl);
        }
        return pictures;
    }, [count]);
    return { profilePictures, loading: false };
};

const Footer = () => {
    const { profilePictures, loading } = useRandomProfilePictures(4);
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || submitting) return;
        setSubmitting(true);
        try {
            await joinWaitlist(email.trim());
            setEmail("");
            setToast({ message: 'Joined waitlist successfully!', kind: 'success' });
        } catch (err: unknown) {
            setToast({ message: err instanceof Error ? err.message : 'Something went wrong', kind: 'error' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    return (
        <div className=' bg-snow-100 py-10 page-padding-x justify-between border-b border-brand-p3/70 items-center'>
            <p className='text-4xl text-neutral-n2 mb-3 font-bold'>Join the waitlist!</p>
            <p className='text-neutral-n2 mb-7'>Get early access to the Game-Changing Platform, Where the Banter gets Better</p>

            <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-y-3  mb-5 items-center'>
                <input
                    type="email"
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className='bg-white w-full px-4 py-2 rounded-l  outline-none focus:border-1  border-brand-p4'
                    required
                />
                <button type="submit" disabled={submitting} className='secondary w-50 font-medium text-[14px] outline-none text-white cursor-pointer px-4 py-2  rounded-r  hover:bg-blue-600 transition-colors duration-200'>
                    {submitting ? 'Joining…' : 'Join Now!'}
                </button>
            </form>

            <div className="flex items-center mb-30  max-w-lg gap-2 text-gray-600">
                <div className="flex -space-x-1">
                    {loading ? (
                        <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white"></div>
                    ) : (
                        profilePictures.map((picture, index) => (
                            <img
                                key={index}
                                src={picture}
                                alt={`Profile ${index + 1}`}
                                className="w-6 h-6 rounded-full border-2 border-white"
                            />
                        ))
                    )}
                </div>
                <span className="text-sm">Join 1014+ others in the waitlist</span>
            </div>

            <div className='flex justify-center text-sm text-neutral-n3 items-center gap-7'>
            <Link href='https://www.youtube.com/@TikiAnaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Youtube</Link>
                    <Link href='https://medium.com/@tikianaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Medium</Link>
                    <Link href='https://facebook.com/tikianaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Facebook</Link>
                    <Link href=' https://www.instagram.com/tikianalyapp' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Instagram</Link>
                    <Link href='https://x.com/TikiAnaly' className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>X</Link>
            </div>
            <div className="flex gap-7 mt-9  text-neutral-n4 justify-center">
                <Facebook  className='w-5'/>
                <X className='w-5' />
                <InstagramIcon className='w-5' />
            </div>
            {toast && (
                <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded text-white shadow-lg ${toast.kind === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toast.message}
                </div>
            )}
        </div>
    )
}

export default Footer


