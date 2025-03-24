import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Add fetchCurrentUser thunk
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Try to get token from multiple sources
      let token = localStorage.getItem("token");
      
      // If no token in localStorage, check cookies
      if (!token) {
        const getCookieValue = (name) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
          return null;
        };
        
        token = getCookieValue("clientToken") || getCookieValue("token");
        
        // Save token to localStorage if found in cookies
        if (token) {
          localStorage.setItem("token", token);
        }
      }
      
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid token
          localStorage.removeItem("token");
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "clientToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.currentUser;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

// Add logoutUser thunk
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { dispatch }) => {
    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      console.error("Error during logout API call:", error);
    } finally {
      // Clear all client-side storage
      localStorage.removeItem("token");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "clientToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Clear user state
      dispatch(clearUser());
      
      // Redirect to login page
      window.location.href = "/login";
    }
  }
);

const initialState = {
  currentUser: null,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;