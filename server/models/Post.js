import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        'Culture',
        'Legends',
        'Skills',
        'Tactics',
        '5-a-Side',
        "Women's Game",
        'Development',
        'Community',
        'Fitness',
        'Wellness',
      ],
    },
    author: {
      name: String,
      image: String,
    },
    tags: [String],
    readingTime: {
      type: Number,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
