import { Request, Response } from "express";
import User from "../models/User";

// Controller to update user roles
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId, newRole } = req.body;

    // Validate inputs
    if (!userId || !newRole) {
      res.status(400).json({ error: "User ID and new role are required" });
      return;
    }

    const allowedRoles = ["user", "moderator", "admin"];
    if (!allowedRoles.includes(newRole.toLowerCase())) {
      res
        .status(400)
        .json({ error: `Role must be one of ${allowedRoles.join(", ")}` });
      return;
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Update the user's role
    if (newRole === "Admin") {
      user.role = "Admin";
      await user.save();
    } else {
      user.role = newRole.toLowerCase();
      await user.save();
    }

    res.status(200).json({ message: `User role updated to ${newRole}`, user });
  } catch (error) {
    res.status(500).json({ error: "Error updating user role" });
  }
};

// Controller to get all registered users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user.role; // Get the role of the requesting user

    // Only allow admins to fetch all users
    if (userRole !== "Admin") {
      res.status(403).json({ error: "Access forbidden: Admins only" });
      return;
    }

    // Fetch all users from the database
    const users = await User.find({}, "-password -refreshToken"); // Exclude the password field for security

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error while fetching users" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Extract user ID from route parameters

    // Find and delete the user by ID
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error while deleting user" });
  }
};
