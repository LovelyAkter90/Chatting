import { createSlice } from "@reduxjs/toolkit";

export const ActiveSingelSlice = createSlice({
  name: "Singel",
  initialState: {
    active: localStorage.getItem("ActiveSingle")
      ? JSON.parse(localStorage.getItem("ActiveSingle"))
      : null,
  },
  reducers: {
    Activesingel: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const { Activesingel } = ActiveSingelSlice.actions;

export default ActiveSingelSlice.reducer;
