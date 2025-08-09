import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import CreatePost from "./pages/CreatePost";
import ProfilePage from "./pages/ProfilePage";
import StoriesPage from "./pages/StoriesPage";
import CommentPage from "./pages/CommentPage"; // varsa kullanılır

export default function App() {
  return (
    <Router>
      <div className="nav"><Navbar /></div>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/comments/:postId" element={<CommentPage />} />
        </Routes>
      </div>
    </Router>
  );
}
