export default function CommentList({ comments }) {
  return (
    <div className="mt-3">
      {comments.length === 0 && (
        <p className="text-gray-500 text-sm">Henüz yorum yok</p>
      )}
      {comments.map((c, i) => (
        <div key={i} className="flex items-start space-x-2 mb-2">
          <img
            src={c.avatar}
            alt={c.username}
            className="w-8 h-8 rounded-full"
          />
          <div className="bg-gray-100 rounded-lg px-3 py-1">
            <span className="font-semibold">{c.username}: </span>
            <span>{c.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
