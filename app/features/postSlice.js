// features/postSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  myPosts: [],
  loading: false,
  error: null,
  loadingStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  fetchError: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.loadingStatus = 'loading';
      state.error = null;
      state.fetchError = null;
    },
    postFailed: (state, action) => {
      state.loading = false;
      state.loadingStatus = 'failed';
      state.error = action.payload;
      state.fetchError = action.payload;
    },
    //  -- FETCH / ADD POSTS --
    postAdded: (state, action) => {
      state.loading = false;
      state.loadingStatus = 'succeeded';
      state.posts.push(action.payload);
    },
    postsFetched: (state, action) => {
      state.loading = false;
      state.loadingStatus = 'succeeded';
      
      // Gelen verileri kontrol et ve doğrula
      if (Array.isArray(action.payload)) {
        state.posts = action.payload.map(post => {
          // Gerekli alanların var olduğundan emin ol
          return {
            ...post,
            likes: post.likes || [],
            comments: post.comments || [],
            images: post.images || [],
            categories: post.categories || [],
            views: post.views || 0,
            author: post.author || {
              _id: "anonymous",
              name: "Anonim Kullanıcı",
              avatar: "/fallback-avatar.png"
            }
          };
        });
      } else {
        console.error("Posts data is not an array:", action.payload);
        state.posts = [];
        state.error = "Gelen post verisi geçerli bir dizi değil";
      }
    },
    myPostsFetched: (state, action) => {
      state.loading = false;
      state.loadingStatus = 'succeeded';
      
      // Gelen verileri kontrol et ve doğrula
      if (Array.isArray(action.payload)) {
        state.myPosts = action.payload.map(post => {
          // Gerekli alanların var olduğundan emin ol
          return {
            ...post,
            likes: post.likes || [],
            comments: post.comments || [],
            images: post.images || [],
            categories: post.categories || [],
            views: post.views || 0,
            author: post.author || {
              _id: "anonymous",
              name: "Anonim Kullanıcı",
              avatar: "/fallback-avatar.png"
            }
          };
        });
      } else {
        console.error("My posts data is not an array:", action.payload);
        state.myPosts = [];
        state.error = "Gelen kişisel post verisi geçerli bir dizi değil";
      }
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
        if (!post.likes) post.likes = []; // Eğer likes array'i yoksa oluştur
        
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
        if (!myPost.likes) myPost.likes = []; // Eğer likes array'i yoksa oluştur
        
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
        if (!post.likes) post.likes = []; // Eğer likes array'i yoksa oluştur
        
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
        if (!myPost.likes) myPost.likes = []; // Eğer likes array'i yoksa oluştur
        
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
        if (!state.posts[postIndex].comments) state.posts[postIndex].comments = [];
        state.posts[postIndex].comments.push(comment);
      }
      const myIndex = state.myPosts.findIndex((p) => p._id === postId);
      if (myIndex !== -1) {
        if (!state.myPosts[myIndex].comments) state.myPosts[myIndex].comments = [];
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
      if (postIndex !== -1 && state.posts[postIndex].comments) {
        state.posts[postIndex].comments = state.posts[postIndex].comments.filter(
          (c) => c._id !== commentId
        );
      }
      const myIndex = state.myPosts.findIndex((p) => p._id === postId);
      if (myIndex !== -1 && state.myPosts[myIndex].comments) {
        state.myPosts[myIndex].comments = state.myPosts[myIndex].comments.filter(
          (c) => c._id !== commentId
        );
      }
    },
    
    // Post görüntüleme sayısını artırma
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