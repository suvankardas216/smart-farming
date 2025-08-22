import express from "express";
import { createPost, getAllPosts, getPost, addComment, upvotePost, downvotePost } from "../controllers/forumController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",protect, getAllPosts);
router.get("/:id",protect, getPost);
router.post("/", protect, createPost);
router.post("/:id/comment", protect, addComment);
router.put("/:id/upvote", protect, upvotePost);
router.put("/:id/downvote", protect, downvotePost);

export default router;
