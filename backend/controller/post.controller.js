import Post from '../../src/Schema/post.js';
import path from 'path';
import fs from 'fs';

// 🔹 Créer un post avec média
export const createPostWithMedia = async (req, res) => {
  try {
    const { content, user, initials } = req.body;
    if (!initials) return res.status(400).json({ message: 'Initials is required' });

    const media = req.file ? req.file.filename : null;

    const newPost = new Post({
      content,
      user,
      initials,
      media,
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      comments: [],
      shares: 0
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Erreur création post avec média:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// 🔹 Créer un post simple
export const createPost = async (req, res) => {
  try {
    const { content, user, initials } = req.body;
    const media = req.file ? req.file.filename : undefined;

    const newPost = new Post({
      content,
      user,
      initials,
      media,
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      comments: [],
      shares: 0
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur création post', error: err });
  }
};

// 🔹 Récupérer tous les posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération posts', error: err });
  }
};

// 🔹 Liker / unliker
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });

    post.isLiked = !post.isLiked;
    post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Erreur like post', error: err });
  }
};

// 🔹 Ajouter un commentaire
export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });

    post.comments.push({
      user: req.body.user,
      initials: req.body.initials,
      text: req.body.text,
      time: req.body.time || new Date().toISOString()
    });

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error('Erreur ajout commentaire:', err);
    res.status(500).json({ message: 'Erreur ajout commentaire', error: err.message });
  }
};

// 🔹 Supprimer un commentaire
export const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });

    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// 🔹 Supprimer un post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });

    if (post.media) {
      const filePath = path.join(path.resolve('./'), 'uploads', post.media);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await post.deleteOne();
    res.json({ message: 'Post supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression post', error: err });
  }
};

// 🔹 Modifier un post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });

    if (req.body.content) post.content = req.body.content;

    if (req.file) {
      if (post.media) {
        const oldPath = path.join(path.resolve('./'), 'uploads', post.media);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      post.media = req.file.filename;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Erreur modification post', error: err });
  }
};
