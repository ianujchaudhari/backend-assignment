import { Request, Response } from "express";
import User from "../models/User";

// Controller to update user roles for any user
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId, newRole } = req.body;

    //check for Validate inputs
    if (!userId || !newRole) {
      res.status(400).json({ error: "User ID and new role are required" });
      return;
    }

    // check for allowed roles based on array
    const allowedRoles = ["user", "moderator", "admin"];
    if (!allowedRoles.includes(newRole.toLowerCase())) {
      res
        .status(400)
        .json({ error: `Role must be one of ${allowedRoles.join(", ")}` });
      return;
    }

    // Find the user by ID from Db
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
    // Fetch all users from the database
    const users = await User.find({}, "-password -refreshToken"); // Exclude the password field for security

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error while fetching users" });
  }
};

// Controller to delete any registered users
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // Extract user ID from route parameters
    const { id } = req.params;

    //  check if user exists
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    // Find and delete the user by ID
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error while deleting user" });
  }
};
