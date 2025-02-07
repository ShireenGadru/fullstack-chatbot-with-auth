import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/users.model.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplates.js";
import transporter from "../config/nodemailer.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "Invalid token");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "unable to generate access and refresh token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get data from req body

  const { email, name, password } = req.body;

  //validate if data is present
  if ([email, name, password].some((value) => value?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  //check if user already exists

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  // store data in databse

  const user = await User.create({
    email,
    password,
    name,
  });
  //check if data is stored

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(400, "Error while registering user");
  }
  //return response

  res
    .status(201)
    .json(
      new ApiResponse(201, user, `User ${user?.name} registered successfully`)
    );
});

const loginUser = asyncHandler(async (req, res) => {
  //get email pwd from req body
  const { email, password } = req.body;

  //check if details are empty

  if ([email, password].some((field) => field.trim() === "")) {
    ``;
    throw new ApiError(400, "Email and password is required");
  }
  //find user in database with email

  const user = await User.findOne({ email });

  //check if user exists
  if (!user) {
    throw new ApiError(400, "cannot find user with this email");
  }
  //match password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "incorrect password");
  }

  //generate access and refresh token

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );
  //get updated user
  const loggedInUser = await User.findById(user?._id).select(
    "_id name email profileImage isAccountVerified"
  );

  //send response with cookies and updated user
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // remove refresh token from db
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );
  //clear cookies and send response
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };
  res
    .status(201)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const sendPasswordResetOtp = asyncHandler(async (req, res) => {
  // get email from User
  const { email } = req.body;
  //verify email
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  //fetch user from email
  const user = await User.findOne({ email });
  // validate if user exists
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  //generate otp
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  // set otp and expiry in BE
  user.resetOtp = otp;
  user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; //in milliseconds

  await user.save({ validateBeforeSave: false });
  // send otp mail
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user?.email,
    subject: "Password reset OTP",
    html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
      "{{email}}",
      user?.email
    ),
  };

  await transporter.sendMail(mailOptions);

  //send response, otp sent to your mail
  res.status(200).json(new ApiResponse(200, {}, "Otp send to your mail"));
});

const verifyPasswordResetOtp = asyncHandler(async (req, res) => {
  //get email, otp  from req body
  const { email, otp } = req.body;
  //verify email and otp
  if (!email || !otp) {
    throw new ApiError(400, "Email and otp is required");
  }

  //get user from db using email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Invalid email. User not found");
  }
  //check if otp is correct
  if (user.resetOtp !== otp || user.resetOtp === "") {
    throw new ApiError(400, "Invalid Otp");
  }

  if (user.resetOtpExpireAt < Date.now()) {
    throw new ApiError(400, "Otp expired");
  }
  // add expiry time to  passwordResetVerificationExpiry
  user.passwordResetVerificationExpiry = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });
  //submit response that otp is correct

  res.status(200).json(new ApiResponse(200, {}, "Password reset Otp verified"));
});

const updatePassword = asyncHandler(async (req, res) => {
  //get email and new pwd from body
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    throw new ApiError(400, "Email and new password is required");
  }
  //verify email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }
  // set new pwd to db
  user.password = newPassword;
  // reset all otp and expiry fields
  user.resetOtp = "";
  user.resetOtpExpireAt = 0;
  user.passwordResetVerificationExpiry = 0;
  await user.save();

  //send response
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const sendEmailVerificationOtp = asyncHandler(async (req, res) => {
  //get user id from req -because of middlware
  const user = await User.findById(req.user?._id);
  // verify user existence
  if (!user) {
    throw new ApiError(400, "Invalid token, user not found");
  }
  //generate otp
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  //add otp to database with expiry
  user.verifyOtp = otp;
  user.verifyOtpExpireAt = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });
  // send otp to mail
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user?.email,
    subject: "Account verification OTP",
    html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
      "{{email}}",
      user?.email
    ),
  };
  await transporter.sendMail(mailOptions);
  //send response
  res.status(200).json(new ApiResponse(200, {}, "Otp sent to email"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  // get otp from req
  const { otp } = req.body;
  //find user using user if from req
  const user = await User.findById(req.user._id);
  // verify if user exists
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  //verify if otp is correct
  if (user.verifyOtp !== otp || user.verifyOtp === "") {
    throw new ApiError(400, "Invalid OTP");
  }
  if (user.verifyOtpExpireAt < Date.now()) {
    throw new ApiError(400, "OTP expired");
  }
  //reset values in database, and add isVerified true
  user.isAccountVerified = true;
  user.verifyOtp = "";
  user.verifyOtpExpireAt = 0;

  await user.save({ validateBeforeSave: false });
  //send response

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAccountVerified: user.isAccountVerified,
          profileImage: user.profileImage,
        },
      },
      "Email verified"
    )
  );
});

const updateProfileImage = asyncHandler(async (req, res) => {
  // get file from

  const profileImageLocalPath = req.file?.path;
  // check if file is valid
  if (!profileImageLocalPath) {
    throw new ApiError(400, "Invalid image file");
  }

  // upload file to cloudinary
  const profileImage = await uploadOnCloudinary(profileImageLocalPath);
  //check if file is uploaded
  if (!profileImage) {
    throw new ApiError(400, "Error while uploading file");
  }
  // add image url to user db

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profileImage: profileImage?.url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (user?.profileImage !== profileImage.url) {
    throw new ApiError(400, "Failed to update profile Image");
  }
  //send response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedUrl: user?.profileImage },
        "Profile image updated successfully"
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // refresh token from cookies
  const incomingRefreshToken = req.cookies.refreshToken;
  //validate if refersh token exists

  if (!incomingRefreshToken) {
    throw new ApiError(400, "invalid refresh token");
  }

  // decode token

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  //get user from token
  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  // check if refresh token matches with the one that is in user db

  if (user.refreshToken !== incomingRefreshToken) {
    console.log(user.refreshToken, incomingRefreshToken);

    throw new ApiError(400, "Refresh token has expired. Please login.");
  }

  // if not, then token is expired so need to login again
  // if refresh token is same, then generate new access and resfresh token

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };

  // send the reponse and update cookies
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, {}, "Access Token regenerated"));
});

const getUserData = asyncHandler(async (req, res) => {
  // get user from req (secured route)
  const user = req.user;
  //check if user exists
  if (!user) {
    throw new ApiErrorr(401, "User not found");
  }

  // send user details in response
  res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        profileImage: user?.profileImage,
        isAccountVerified: user?.isAccountVerified,
      },
      "User data retreived successfully"
    )
  );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  verifyPasswordResetOtp,
  sendPasswordResetOtp,
  updatePassword,
  sendEmailVerificationOtp,
  verifyEmail,
  updateProfileImage,
  refreshAccessToken,
  getUserData,
};
