import  { useState } from "react";
import ReadAlso from "../components/readalso";

const blogData = {
  title: "Inter Milan beat Cremonese 4-1 to join Serie A summit",
  writer: "John Doe",
  time: "2 hours ago",
  views: 1200,
  image:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  text: `Arne Slot's reigning champions snatched wins with late goals in the early stages of the defence of their title, relying on dramatic final acts to escape to victory while disguising form that has been indifferent since the season started.

Bournemouth, Newcastle United, Arsenal, Burnley and Atletico Madrid all fell to last-gasp blows – but it was a high-risk unsustainable strategy, especially with Liverpool so far from their best.

And now they have received a bitter taste of their own medicine twice in seven days.

Chelsea's deserved 2-1 win at Stamford Bridge came courtesy of Estevao Willian's 95th-minute strike, while Liverpool's first Premier League defeat of the season was inflicted by Eddie Nketiah's 97th-minute goal for Crystal Palace at Selhurst Park.

In between these defeats, Galatasaray beat Liverpool 1-0 in the unique atmosphere of Istanbul's imposing RAMS Park in the Champions League, Slot losing three successive games for the first time in his coaching career.

Slot was in defiant mood in the aftermath of another disappointment, going through his full range of brave faces while accentuating the positive in the face of evidence to the contrary.

"Last week, same as this week, the fine margins haven't been in our favour," Slot told BBC Match of the Day.

"In both games we've created more chances than the team we have faced - Palace and Chelsea - but the truth is that we have only scored once in both games and our opponent has scored twice."

Fine margins indeed - but there is no denying the remarkable swing in fortunes. A staggering 10 goals have been scored after the 80th-minute mark in Liverpool's 11 games so far this season.

All but two of those goals have altered the result of the match.`,
  hashtags: ["#InterMilan", "#SerieA", "#Football", "#Victory"],
};

const reactions = [
  { icon: "❤️", label: "Love" },
  { icon: "👏", label: "Clap" },
  { icon: "🔥", label: "Fire" },
  { icon: "👎", label: "Dislike" },
];

const BlogReadPage = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-12 py-8 max-w-7xl mx-auto">
      {/* Main Content */}
      <div className="w-full md:w-7/10 lg:w-7/10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {blogData.title}
        </h1>
        <div className="flex items-center text-sm text-gray-500 mb-4 gap-3">
          <span>By {blogData.writer}</span>
          <span>•</span>
          <span>{blogData.time}</span>
          <span>•</span>
          <span>{blogData.views.toLocaleString()} views</span>
        </div>
        <img
          src={blogData.image}
          alt={blogData.title}
          className="w-full aspect-video object-cover rounded-lg mb-6"
        />
        <div className="text-base text-gray-800 mb-6 leading-relaxed">
          {blogData.text}
        </div>
        <div className="flex flex-wrap gap-2 mb-10">
          {blogData.hashtags.map((tag) => (
            <span
              key={tag}
              className="bg-brand-p3/10 text-brand-p3 px-3 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Reactions */}
        <div className="flex gap-6 mt-8 mb-2">
          {reactions.map((reaction) => (
            <button
              key={reaction.label}
              className={`flex  flex-col items-center p-1 group focus:outline-none transition-transform duration-200
                ${
                  selected === reaction.label
                    ? "bg-brand-p3/20 rounded-full  scale-125"
                    : ""
                }
              `}
              aria-label={reaction.label}
              type="button"
              onClick={() => setSelected(reaction.label)}
            >
              <span className="text-xl ">{reaction.icon}</span>
            </button>
          ))}
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
