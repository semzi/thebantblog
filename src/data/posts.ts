export type LocalPost = {
  id: string | number;
  title: string;
  image: string;
  time: string;
  views: number;
};

// Replace this sample data with your real posts or import JSON
export const posts: LocalPost[] = [
  {
    id: 1,
    title: "Getting Started with TypeScript",
    image: "/images/ts-intro.jpg",
    time: "Today",
    views: 1234,
  },
  {
    id: 2,
    title: "Understanding React Hooks in Depth",
    image: "/images/react-hooks.jpg",
    time: "2 days ago",
    views: 9876,
  },
  {
    id: 3,
    title: "Styling with Tailwind CSS: A Practical Guide",
    image: "/images/tailwind-guide.jpg",
    time: "Last week",
    views: 4567,
  },
];


