import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/app/features/UserSlice";
import postReducer from "@/app/features/postSlice"; // ✅ Post reducer'ı ekledik
import friendReducer from "@/app/features/friendSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    friend:friendReducer,
  },
});

export default store;
