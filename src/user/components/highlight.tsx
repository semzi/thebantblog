import {
  ArrowUpRight,
  BookmarkIcon,
  HeartIcon,
  Send,
  ShareIcon,
} from "lucide-react";

const Highlight = () => {
  return (
    <div>
      {/* <p className="font-semibold tex text-3xl flex mb-2 items-center gap-5 dark:text-snow-200 text-[#23272A]">
        Latest News <img src="/fire.gif" className="w-7" alt="" />
      </p> */}
      <p className="text-neutral-n4 mb-4">Home &gt; News &gt; Football</p>
      <div className="flex gap-5">
        <div className="bg-[url('2.jpg')] flex-4 rounded shadow-xl relative bg-center h-90 ">
          <div className="absolute bg-gradient-to-t from-black/80 to-transparent inset-0 rounded-[8px] pointer-events-none" />
          <div className="flex flex-col absolute bottom-8 w-full px-10 gap-y-2">
            <div className="flex items-center text-white gap-2 sz-7 ">
              <img src="dembele.png" alt="" className="w-6 h-6 rounded-full" />
              <span>TikiAnaly</span>
              <span>|</span>
              <span>6 mins read</span>
            </div>
            <p className="text-white  sz-4 font-bold">
              Ath Madrid. Forward Ousmane Dembele Has Agreed To Join Barcelona
              On A Free Transfer This Summer
            </p>
            <div className="flex justify-between">
              <div className="flex gap-3">
                <span className="text-white sz-7">6 hours ago</span>
                <HeartIcon className="w-5 h-5  cursor-pointer text-brand-secondary" />
                <BookmarkIcon className="w-5 h-5 cursor-pointer text-white" />
                <ShareIcon className="w-5 h-5 cursor-pointer text-white" />
              </div>
              <div className="hidden md:flex animate-bounce bg-snow-100/20 px-6 py-1 rounded-full text-white gap-2 text-sm">
                Read post
                <ArrowUpRight className="w-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex overflow-y-auto hide-scrollbar flex-2 gap-3 text-sm h-90 flex-col edge-lighting block-style relative">
              {/* Overlay gradient with text */}
              <div className="absolute  left-0 right-0 bottom-0 pb-7 bg-gradient-to-t from-black/5 to-transparent w-full items-end z-2">
                <form action="" className="flex gap-2 w-full px-3">
                  <input type="text" className="rounded-full  outline-none py-2 px-5 text-black bg-snow-200 focus:bg-snow-100 w-full" />
                  <button className='secondary rounded-full py-2 px-4 text-white'>
                        <Send className='w-4 h-4 ' />
                    </button>
                </form>
              </div>

              <p className="font-[500] mb-1 flex items-center sz-4 theme-text">
                Comments <img src="/fire.gif" className="w-5 ml-auto" alt="" />
              </p>
              <div className="flex  sz-8 items-center  gap-">
                <div className="flex items-center gap-2">
                  <img
                    src="/players/Sasha Vezenkov.png"
                    alt=""
                    className="h-5 rounded-full"
                  />
                  <div className="block">
                    <p className="text-neutral-m6 text-xs">Anonymous</p>
                    <p className="">
                      City wasted a lot on Signings this season...{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>

      </div>
    </div>
  );
};

export default Highlight;
