import { User } from "../models/users.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    //get token from cookies or headers
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    //check if token existts
    if (!token) {
      throw new ApiError(401, "Invalid access token");
    }

    //get decoded token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //get user from token id
    const user = await User.findById(decodedToken?.user_id).select(
      "-password -refreshToken"
    );
    //check if user exists
    if (!user) {
      throw new ApiError(401, "User not found");
    }
    // add user to req
    req.user = user;

    //next
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export default verifyJwt;
