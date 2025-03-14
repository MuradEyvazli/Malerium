// /models/FriendRequest.js
import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String,
      default: "https://images.pexels.com/photos/30327309/pexels-photo-30327309/free-photo-of-6-2025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Varsayılan avatar URL'si
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.FriendRequest ||
  mongoose.model("FriendRequest", FriendRequestSchema);
