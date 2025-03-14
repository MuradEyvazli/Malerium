'use client';
import React, { useState } from 'react';

const HelpCenter = () => {
  const [posts, setPosts] = useState([
    { id: 1, user: "Alex", title: "Need feedback on my minimalist portfolio design", content: "Hey everyone, I just finished designing a new portfolio. I’d love to hear your thoughts!", date: "2 hours ago" },
    { id: 2, user: "Emma", title: "Color palette suggestions?", content: "I’m struggling to choose the right color scheme for my project. Any ideas?", date: "5 hours ago" },
    { id: 3, user: "Jordan", title: "Typography help needed", content: "Which font combinations work best for a clean UI?", date: "Yesterday" }
  ]);
  
  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = () => {
    if (newPost.trim() !== "") {
      const newEntry = {
        id: posts.length + 1,
        user: "Guest",
        title: "New Design Question",
        content: newPost,
        date: "Just now"
      };
      setPosts([newEntry, ...posts]);
      setNewPost("");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-16 px-6 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-center">Help Center</h1>
      <p className="text-lg text-gray-500 mt-4 text-center max-w-3xl">Share your design challenges, ask for feedback, and help others with their work.</p>
      
      <div className="w-full max-w-4xl mt-10">
        <textarea
          placeholder="Ask your question or share your design thoughts..."
          className="w-full p-4 text-lg border-b border-gray-300 focus:outline-none focus:border-black"
          rows="3"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button 
          onClick={handlePostSubmit}
          className="w-full mt-4 py-3 bg-black text-white font-bold text-lg hover:bg-gray-800 transition"
        >
          Post
        </button>
      </div>
      
      <div className="w-full max-w-4xl mt-16 space-y-8">
        {posts.map(post => (
          <div key={post.id} className="w-full border-b border-gray-300 pb-6">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="text-gray-600 mt-2">{post.content}</p>
            <span className="text-sm text-gray-400">{post.user} • {post.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCenter;
