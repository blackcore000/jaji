export default function StoryViewer({ story, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        ✖
      </button>
      <img
        src={story.image}
        alt="Story"
        className="max-h-[80%] rounded-lg"
      />
      <p className="text-white mt-4">{story.caption}</p>
    </div>
  );
}
