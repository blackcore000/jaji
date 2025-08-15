import { useState } from "react";
import { comments as initialComments } from "../data/commentsData";

export default function Comments({ postId }) {
  const [commentList, setCommentList] = useState(initialComments[postId] || []);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const updatedComments = [
      ...commentList,
      { id: commentList.length + 1, username: "Sen", text: newComment }
    ];
    setCommentList(updatedComments);
    setNewComment("");
  };

  return (
    <div className="mt-4 border-t pt-2">
      <h3 className="font-semibold">Yorumlar</h3>
      {commentList.map((comment) => (
        <div key={comment.id} className="text-sm my-1">
          <span className="font-bold">{comment.username}: </span>
          {comment.text}
        </div>
      ))}

      <div className="flex mt-2">
        <input
          type="text"
          placeholder="Yorum yaz..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border p-2 rounded-l"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 rounded-r"
        >
          Gönder
        </button>
      </div>
    </div>
  );
}
