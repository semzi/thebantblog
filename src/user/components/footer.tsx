import { Facebook, InstagramIcon, X } from 'lucide-react';
import  { useState, useEffect } from 'react'
// Custom hook to fetch random profile pictures
const useRandomProfilePictures = (count: number) => {
    const [profilePictures, setProfilePictures] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfilePictures = async () => {
            try {
                // Using DiceBear API for reliable avatar generation
                const pictures = [];
                for (let i = 0; i < count; i++) {
                    // Generate random avatars using DiceBear API
                    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
                    pictures.push(avatarUrl);
                }
                setProfilePictures(pictures);
            } catch (error) {
                console.error("Error fetching profile pictures:", error);
                // Fallback to default colored circles if API fails
                setProfilePictures([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProfilePictures();
    }, [count]);

    return { profilePictures, loading };
};

const footer = () => {
    const { profilePictures, loading } = useRandomProfilePictures(4);
    return (
        <div className=' bg-snow-100 py-10 page-padding-x justify-between border-b border-brand-p3/70 items-center'>
            <p className='text-4xl text-neutral-n2 mb-3 font-bold'>Join the waitlist!</p>
            <p className='text-neutral-n2 mb-7'>Get early access to the Game-Changing Platform, Where the Banter gets Better</p>

            
                <form action=" " className='flex flex-col md:flex-col-reverse gap-y-3  mb-5 items-center'>
                    <input type="text" placeholder='Enter your email' className='bg-white w-full px-4 py-2 rounded-l  outline-none focus:border-1  border-brand-p4' />
                    <input type="button" value="Join Now!" className='secondary w-50 font-medium text-[14px] outline-none text-white cursor-pointer px-4 py-2  rounded-r  hover:bg-blue-600 transition-colors duration-200' typeof='submit' />
                </form>
            

            {/* Social Proof */}
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
                <button className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Home</button>
                <button className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Blog</button>
                <button className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>News</button>
                <button className='hover:text-brand-secondary transition-colors duration-300 cursor-pointer'>Transfer News</button>
            </div>
                    <div className="flex gap-7 mt-9  text-neutral-n4 justify-center">
                        <Facebook  className='w-5'/>
                        <X className='w-5' />
                        <InstagramIcon className='w-5' />
                    </div>
        </div>
    )
}

export default footer