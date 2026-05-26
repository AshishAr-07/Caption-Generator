import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No token provided",
      });
    }

    const decoded =  await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or invalid token",
      });
    }

    // Store user in request object
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in JWT verification:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};