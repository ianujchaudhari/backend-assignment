import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET || "backend_assignment_jwt_secret", {
    expiresIn: process.env.TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ userId ,role}, process.env.REFRESH_TOKEN_SECRET || "backend_assignment_jwt_secret", {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already Registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "user"
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user._id as string, user.role);

    const refreshToken = generateRefreshToken(user._id as string, user.role);

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
    console.log(err);
  }
};

// Refresh Token
const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(403).json({ error: "Refresh token required" });
    return;
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { userId: string };

    // Check if the refresh token is valid in the database
    const user = await User.findOne({ _id: decoded.userId, refreshToken });
    if (!user) {
      res.status(403).json({ error: "Invalid refresh token" });
      return;
    }
    // Generate new access token
    const accessToken = generateAccessToken(user._id as string, user.role);
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid refresh token" });
  }
};

const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  try {
    // Remove refresh token from the database
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

    res
      .status(200)
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error logging out" });
  }
};

export { register, login, refreshToken, logout };
