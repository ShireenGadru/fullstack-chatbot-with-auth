import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  isAccountVerified: boolean;
}

interface UserState {
  userData: IUser | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  userData: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoggedInUser: (state, action: PayloadAction<IUser>) => {
      state.userData = action.payload;
    },
    updateAccountVerification: (state) => {
      if (state.userData) {
        state.userData.isAccountVerified = true;
      }
    },
    updateProfileImage: (state, action: PayloadAction<string>) => {
      if (state.userData) {
        state.userData.profileImage = action.payload;
        console.log("here");
      }
    },
    resetUserdata: (state) => {
      state.userData = null;
    },
    isUserLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const {
  setLoggedInUser,
  updateAccountVerification,
  updateProfileImage,
  resetUserdata,
  isUserLoggedIn
} = userSlice.actions;
export default userSlice.reducer;
