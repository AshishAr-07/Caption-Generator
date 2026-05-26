import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Field are Required" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    if (user) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: { name: user.name, email: user.email },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Field are Required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = generateToken(user.email );

    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log("Error in loginController:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const logoutController = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("Error in logoutController:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const profileController = async (req, res) => {
  try {
    const user = req.user;
    const token = req.cookies?.accessToken;

    return res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.log("Error in profileController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};