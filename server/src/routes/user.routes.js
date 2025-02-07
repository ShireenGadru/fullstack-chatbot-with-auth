import express from "express";
import {
  getUserData,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  sendEmailVerificationOtp,
  sendPasswordResetOtp,
  updatePassword,
  updateProfileImage,
  verifyEmail,
  verifyPasswordResetOtp,
} from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/send-reset-pwd-otp", sendPasswordResetOtp);
userRouter.post("/verify-reset-pwd-otp", verifyPasswordResetOtp);
userRouter.post("/update-password", updatePassword);
userRouter.post("/refresh-token", refreshAccessToken);

//secured Routes
userRouter.post("/logout", verifyJwt, logoutUser);
userRouter.post("/send-verify-email-otp", verifyJwt, sendEmailVerificationOtp);
userRouter.post("/verify-email", verifyJwt, verifyEmail);
userRouter.post(
  "/update-image",
  verifyJwt,
  upload.single("profileImage"),
  updateProfileImage
);
userRouter.get("/user-data", verifyJwt, getUserData);
export default userRouter;
