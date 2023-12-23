import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "login",
  initialState: {
    loggedIn: localStorage.getItem("users")
      ? JSON.parse(localStorage.getItem("users"))
      : null,
  },
  reducers: {
    LoginUsers: (state, action) => {
      state.loggedIn = action.payload;
    },
  },
});

export const { LoginUsers } = userSlice.actions;

export default userSlice.reducer;
