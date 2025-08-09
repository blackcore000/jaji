const posts = [
  {
    id: "1",
    username: "blackcore",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=blackcore",
    content: "Jaji başlıyor. Kardeşimle omuz omuza! 💙",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    likes: 12,
    retweets: 3,
    views: 180,
    timestamp: Date.now() - 1000 * 60 * 60 * 5
  },
  {
    id: "2",
    username: "jaji",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=jaji",
    content: "Özgürlük bir yazgı değil, bir eylemdir.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    likes: 5,
    retweets: 1,
    views: 95,
    timestamp: Date.now() - 1000 * 60 * 60 * 20
  }
];

export default posts;