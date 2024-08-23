import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "auth/session",
  initialState: {
    token: "",
    signedIn: false,
    expired: "",
  },
  reducers: {
    onSignInSuccess: (state, action) => {
      state.signedIn = true;
      state.token = action.payload;
      state.expired = new Date().getTime() + 59 * 60 * 24 * 1000;
    },
    onSignOutSuccess: (state) => {
      state.signedIn = false;
      state.token = "";
      state.expired = "";
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { onSignInSuccess, onSignOutSuccess, setToken } =
  sessionSlice.actions;

export default sessionSlice.reducer;
