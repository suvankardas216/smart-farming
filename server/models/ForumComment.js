import mongoose from "mongoose";

const forumCommentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "ForumPost", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ForumComment", forumCommentSchema);
