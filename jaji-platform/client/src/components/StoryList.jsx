import { stories } from "../data/storiesData";

export default function StoryList() {
  return (
    <div className="flex space-x-4 overflow-x-auto p-4 bg-white shadow-sm rounded-lg mb-4">
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-pink-500 p-1">
            <img
              src={story.userAvatar}
              alt={story.username}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <p className="text-sm mt-1">{story.username}</p>
        </div>
      ))}
    </div>
  );
}
