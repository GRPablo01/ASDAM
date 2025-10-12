const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: String,
  text: String,
  initials: String,
  time: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: String,
  initials: String,
  media: String,
  mediaType: String,
  mediaUrl: String,
  likes: { type: Number, default: 0 },
  likedBy: { type: [mongoose.Schema.Types.ObjectId], default: [] }, // <-- ici !
  isLiked: { type: Boolean, default: false },
  isBookmarked: { type: Boolean, default: false },
  comments: { type: [commentSchema], default: [] },
  shares: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
