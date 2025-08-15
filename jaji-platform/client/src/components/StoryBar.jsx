import { useState } from "react";
import StoryViewer from "./StoryViewer";

export default function StoryBar({ stories }) {
  const [activeStory, setActiveStory] = useState(null);

  return (
    <div className="flex overflow-x-auto space-x-4 p-3 bg-white shadow rounded-lg mb-4">
      {stories.map((story) => (
        <div
          key={story.id}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setActiveStory(story)}
        >
          <img
            src={story.userAvatar}
            alt={story.username}
            className="w-16 h-16 rounded-full border-4 border-pink-500 p-1"
          />
          <span className="text-xs mt-1">{story.username}</span>
        </div>
      ))}

      {activeStory && (
        <StoryViewer
          story={activeStory}
          onClose={() => setActiveStory(null)}
        />
      )}
    </div>
  );
}
