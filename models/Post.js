import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    avatar: { type: String, required: true }, // Kullanıcının avatarı
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
    // Add this new field
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);