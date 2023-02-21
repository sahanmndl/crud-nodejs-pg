import express from "express";
import { createPost, deletePost, getAllPosts, updatePost } from "../controllers/PostController.js";

const postRouter = express.Router()

postRouter.get('/getAllPosts', getAllPosts)
postRouter.post('/create', createPost)
postRouter.put('/update/:id', updatePost)
postRouter.delete('/delete/:id', deletePost)

export default postRouter