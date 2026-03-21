import { Router } from 'express';
import Comment from '../models/Comment.js';

const router = Router();

// GET /:postId - get all comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /:postId - add comment to a post
router.post('/:postId', async (req, res) => {
  try {
    const comment = await Comment.create({
      postId: req.params.postId,
      author: req.body.author,
      email: req.body.email,
      content: req.body.content,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /:id - delete a comment
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
