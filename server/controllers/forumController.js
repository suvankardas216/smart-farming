import ForumPost from "../models/ForumPost.js";
import ForumComment from "../models/ForumComment.js";

// Create a post
export const createPost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const post = await ForumPost.create({
            title,
            content,
            tags,
            author: req.user._id,
        });
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await ForumPost.find()
            .populate("author", "name role")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single post with comments
export const getPost = async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id).populate("author", "name");
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comments = await ForumComment.find({ post: post._id }).populate("author", "name");
        res.json({ post, comments });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add comment
export const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await ForumComment.create({
            post: req.params.id,
            author: req.user._id,
            content,
        });

        const populatedComment = await comment.populate("author", "name");
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Upvote a post
export const upvotePost = async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (!post.upvotes.includes(req.user._id)) {
            post.upvotes.push(req.user._id);
            post.downvotes = post.downvotes.filter(id => id.toString() !== req.user._id.toString());
            await post.save();
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Downvote a post
export const downvotePost = async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (!post.downvotes.includes(req.user._id)) {
            post.downvotes.push(req.user._id);
            post.upvotes = post.upvotes.filter(id => id.toString() !== req.user._id.toString());
            await post.save();
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
