const express = require('express');
const router = express.Router();
const postController = require('../controller/post.controller');
const multer = require('multer');
const path = require('path');
const Post = require('../../src/Schema/post');

// 🔹 Configuration multer pour uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ Routes de création
router.post('/media', upload.single('media'), postController.createPostWithMedia);
router.post('/', upload.single('media'), postController.createPost);

// 🔹 Récupération posts
router.get('/', postController.getPosts);

// 🔹 Like global
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send({ error: 'Post non trouvé' });

    const userId = req.body.userId; // l'ID de l'utilisateur qui like
    if (!userId) return res.status(400).send({ error: 'Utilisateur manquant' });

    // Si l'utilisateur a déjà liké -> toggle
    post.likedBy = post.likedBy || []; // sécurité si undefined
    const index = post.likedBy.findIndex(u => u.toString() === userId);
    if (index === -1) {
      post.likedBy.push(userId);
    } else {
      post.likedBy.splice(index, 1);
    }

    // compteur global
    post.likes = post.likedBy.length;

    await post.save();

    res.send({
      likes: post.likes,
      isLiked: post.likedBy.includes(userId)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Erreur serveur' });
  }
});

// 🔹 Ajout commentaire
router.post('/:id/comment', async (req, res) => {
  try {
    const postId = req.params.id;
    const { user, text, initials } = req.body;

    if (!user || !text || !initials) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trouvé." });

    post.comments.push({ user, text, initials, time: new Date() });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.error("Erreur ajout commentaire:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 🔹 Supprimer un commentaire
router.delete('/:postId/comment/:commentId', async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });

    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Supprimer un post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });
    res.json({ message: 'Post supprimé avec succès', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
