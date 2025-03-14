import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Tüm kullanıcıları getir
export const fetchAllUsers = createAsyncThunk(
  "friend/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/auth/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Arkadaşlık isteği gönder
export const sendFriendRequest = createAsyncThunk(
  "friend/sendFriendRequest",
  async ({ receiverId, senderName, senderAvatar }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/auth/friends",
        { receiverId, senderName, senderAvatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.friendRequest;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Arkadaşlık isteklerini getir (pending istekler)
export const fetchFriendRequests = createAsyncThunk(
  "friend/fetchFriendRequests",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/auth/friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.friendRequests;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Kabul edilen arkadaşları getir
export const fetchFriends = createAsyncThunk(
  "friend/fetchFriends",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/auth/friends?list=friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.friends;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Arkadaşlık isteğini güncelle (accept/reject)
export const updateFriendRequest = createAsyncThunk(
  "friend/updateFriendRequest",
  async ({ requestId, action }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        "/api/auth/friends",
        { requestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedRequest = response.data.friendRequest;
      if (action === "accept") {
        return { accepted: true, friendRequest: updatedRequest, friend: response.data.friend };
      } else {
        return { accepted: false, friendRequest: updatedRequest };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Arkadaşlık isteğini/ilişkiyi silme
export const deleteFriendRequest = createAsyncThunk(
  "friend/deleteFriendRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/auth/friends", {
        headers: { Authorization: `Bearer ${token}` },
        data: { requestId },
      });
      return requestId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const friendSlice = createSlice({
  name: "friend",
  initialState: {
    users: [],
    friendRequests: [],
    friends: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // fetchAllUsers
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // sendFriendRequest
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Yeni gönderilen isteği pending listesine ekleyelim.
        state.friendRequests.push(action.payload);
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchFriendRequests
      .addCase(fetchFriendRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequests = action.payload;
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchFriends
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateFriendRequest
      .addCase(updateFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        const { accepted, friendRequest, friend } = action.payload;
        // İlgili isteği pending listeden çıkarıyoruz.
        state.friendRequests = state.friendRequests.filter(
          (req) => req._id !== friendRequest._id
        );
        // Eğer kabul edildiyse, accepted friend bilgisini friends listesine ekliyoruz.
        if (accepted && friend) {
          state.friends.push(friend);
        }
      })
      .addCase(updateFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
  },
});

export default friendSlice.reducer;
