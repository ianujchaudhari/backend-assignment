import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

// function to genrate access token including userid and role for verification with specified expiry of 15min
const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    process.env.ACCESS_TOKEN_SECRET || "backend_assignment_jwt_secret",
    {
      expiresIn: process.env.TOKEN_EXPIRY,
    }
  );
};

// function to genrate refresh token including userid and role for verification with specified expiry of 7days
const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET || "backend_assignment_jwt_secret",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// controller to register user
const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // check if user already exist with unique email address
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already Registered" });
      return;
    }

    // hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      // save only hashed password to Db
      password: hashedPassword,
      // by default only users can register
      role: "user",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
};
// controller to login using email and password
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // check if the user exist in Db
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // compare the password with the hashed password while ensuring security for original password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    // generate access token with credentials
    const accessToken = generateAccessToken(user._id as string, user.role);

    // generate refresh token with credentials
    const refreshToken = generateRefreshToken(user._id as string, user.role);

    // save refresh token in Db
    user.refreshToken = refreshToken;
    await user.save();
    // end refresh with HTTPOnly to endure security and not visible to and client side scripts
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

// controller to send access token based on refresh token
const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  // check if token exist in cookies
  if (!refreshToken) {
    res.status(403).json({ error: "Refresh token required" });
    return;
  }

  try {
    // Verify refresh token is valid
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

// controller to implement logout function
const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  // check if token exist in cookies
  if (!refreshToken) {
    res.status(403).json({ error: "Refresh token required" });
    return;
  }

  try {
    // Remove refresh token from the database
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

    // clear cookies from client side
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
