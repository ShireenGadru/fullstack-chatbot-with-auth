import { LoginData, RegisterData } from "../types/auth.types";
import { publicAPI, securedAPI } from "./axiosInstance";

const loginUser = async (formData: LoginData) => {
  try {
    const { data } = await publicAPI.post("/login", formData);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const registerUser = async (formData: RegisterData) => {
  try {
    const { data } = await publicAPI.post("/register", formData);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const sendResetPasswordOTP = async (email: string) => {
  try {
    const { data } = await publicAPI.post("/send-reset-pwd-otp", { email });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const verifyResetPasswordOTP = async (email: string, otp: string) => {
  try {
    const { data } = await publicAPI.post("/verify-reset-pwd-otp", {
      email,
      otp,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const updatePassword = async (email: string, newPassword: string) => {
  try {
    const { data } = await publicAPI.post("/update-password", {
      email,
      newPassword,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

// ==============================================  ***********    SECURED ROUTES    ***********  ====================================================

const updateImage = async (imageData: FormData) => {
  try {
    const { data } = await securedAPI.post(
      "/update-image",
      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

const sendVerifyEmailOTP = async (email: string) => {
  try {
    const { data } = await securedAPI.post("/send-verify-email-otp", {
      email,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const verifyEmail = async (email: string, otp: string) => {
  try {
    const { data } = await securedAPI.post("/verify-email", {
      email,
      otp,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getUserData = async () => {
  try {
    const { data } = await securedAPI.get("/user-data");
    return data;
  } catch (error) {
    console.log(error);
  }
};

export {
  loginUser,
  registerUser,
  sendResetPasswordOTP,
  verifyResetPasswordOTP,
  updatePassword,
  updateImage,
  sendVerifyEmailOTP,
  verifyEmail,
  getUserData,
};
