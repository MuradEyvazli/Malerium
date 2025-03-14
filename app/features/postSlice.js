// features/postSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  myPosts: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    postFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //  -- FETCH / ADD POSTS --
    postAdded: (state, action) => {
      state.loading = false;
      state.posts.push(action.payload);
    },
    postsFetched: (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    },
    myPostsFetched: (state, action) => {
      state.loading = false;
      state.myPosts = action.payload;
    },

    // ----------------------------------------------------------------
    // OPTIMISTIC LIKE
    // ----------------------------------------------------------------
    optimisticLikePost: (state, action) => {
      // action.payload = { postId, userId }
      const { postId, userId } = action.payload;
      const postIndex = state.posts.findIndex((p) => p._id === postId);
      if (postIndex !== -1) {
        const post = state.posts[postIndex];
        const alreadyLiked = post.likes.includes(userId);
        if (alreadyLiked) {
          post.likes = post.likes.filter((uid) => uid !== userId);
        } else {
          post.likes.push(userId);
        }
      }
      const myIndex = state.myPosts.findIndex((p) => p._id === postId);
      if (myIndex !== -1) {
        const myPost = state.myPosts[myIndex];
        const alreadyLiked = myPost.likes.includes(userId);
        if (alreadyLiked) {
          myPost.likes = myPost.likes.filter((uid) => uid !== userId);
        } else {
          myPost.likes.push(userId);
        }
      }
    },
    syncLikePostSuccess: (state, action) => {
      // Replace the post with the server-updated one
      state.loading = false;
      const updatedPost = action.payload;
      const index = state.posts.findIndex((p) => p._id === updatedPost._id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
      const myIndex = state.myPosts.findIndex((p) => p._id === updatedPost._id);
      if (myIndex !== -1) {
        state.myPosts[myIndex] = updatedPost;
      }
    },
    syncLikePostError: (state, action) => {
      // Revert the "optimistic" like
      const { postId, userId } = action.payload;
      const postIndex = state.posts.findIndex((p) => p._id === postId);
      if (postIndex !== -1) {
        const post = state.posts[postIndex];
        const wasLiked = post.likes.includes(userId);
        if (wasLiked) {
          post.likes = post.likes.filter((uid) => uid !== userId);
        } else {
          post.likes.push(userId);
        }
      }
      const myIndex = state.myPosts.findIndex((p) => p._id === postId);
      if (myIndex !== -1) {
        const myPost = state.myPosts[myIndex];
        const wasLiked = myPost.likes.includes(userId);
        if (wasLiked) {
          myPost.likes = myPost.likes.filter((uid) => uid !== userId);
        } else {
          myPost.likes.push(userId);
        }
      }
    },

    // ----------------------------------------------------------------
    // OPTIMISTIC COMMENT
    // ----------------------------------------------------------------
    optimisticCommentPost: (state, action) => {
      // action.payload = { postId, comment: { _id, text, author... } }
      const { postId, comment } = action.payload;
      const postIndex = state.posts.findIndex((p) => p._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].comments.push(comment);
      }
      const myIndex = state.myPosts.findIndex((p) => p._id === postId);
      if (myIndex !== -1) {
        state.myPosts[myIndex].comments.push(comment);
      }
    },
    syncCommentPostSuccess: (state, action) => {
      state.loading = false;
      const updatedPost = action.payload; // API'den dönen güncel post
      const index = state.posts.findIndex((p) => p._id === updatedPost._id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
      const myIndex = state.myPosts.findIndex((p) => p._id === updatedPost._id);
      if (myIndex !== -1) {
        state.myPosts[myIndex] = updatedPost;
      }
    },
    syncCommentPostError: (state, action) => {
      // action.payload = { postId, commentId }
      const { postId, commentId } = action.payload;
      const postIndex = state.posts.findIndex((p) => p._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].comments = state.posts[postIndex].comments.filter(
          (c) => c._id !== commentId
        );
      }
      const myIndex = state.myPosts.findIndex((p) => p._id === postId);
      if (myIndex !== -1) {
        state.myPosts[myIndex].comments = state.myPosts[myIndex].comments.filter(
          (c) => c._id !== commentId
        );
      }
    },
    // features/postSlice.js - Add these to the reducers
postViewIncremented: (state, action) => {
  state.loading = false;
  const updatedPost = action.payload;
  const index = state.posts.findIndex((p) => p._id === updatedPost._id);
  if (index !== -1) {
    state.posts[index] = updatedPost;
  }
  const myIndex = state.myPosts.findIndex((p) => p._id === updatedPost._id);
  if (myIndex !== -1) {
    state.myPosts[myIndex] = updatedPost;
  }
},

    // ----------------------------------------------------------------
    // (Optional) Non-optimistic approach — if you want to keep them
    // ----------------------------------------------------------------
    postLikedOrUnliked: (state, action) => {
      state.loading = false;
      const updatedPost = action.payload;
      const index = state.posts.findIndex((p) => p._id === updatedPost._id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
      const myIndex = state.myPosts.findIndex((p) => p._id === updatedPost._id);
      if (myIndex !== -1) {
        state.myPosts[myIndex] = updatedPost;
      }
    },
    commentAdded: (state, action) => {
      state.loading = false;
      const updatedPost = action.payload;
      const index = state.posts.findIndex((p) => p._id === updatedPost._id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
      const myIndex = state.myPosts.findIndex((p) => p._id === updatedPost._id);
      if (myIndex !== -1) {
        state.myPosts[myIndex] = updatedPost;
      }
    },
  },
});

export const {
  startLoading,
  postFailed,
  postAdded,
  postsFetched,
  myPostsFetched,
  // Optimistic Like
  optimisticLikePost,
  syncLikePostSuccess,
  syncLikePostError,
  // Optimistic Comment
  optimisticCommentPost,
  syncCommentPostSuccess,
  syncCommentPostError,
  // Optional old approach
  postLikedOrUnliked,
  commentAdded,
  postViewIncremented,
} = postSlice.actions;

export default postSlice.reducer;
