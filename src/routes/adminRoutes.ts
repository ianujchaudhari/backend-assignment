// this file only innclude admin specific route to get all users information , change user role and delete all users from db

import express from "express";
import {
  updateUserRole,
  getAllUsers,
  deleteUser,
} from "../controllers/adminController";
import { requireAdmin } from "../middlewares/roleMiddleware";

const router = express.Router();

// update the role of any user either promote him or demote him only for admin 
// requireadmin middleware is used to check if the user is admin or not
router.put("/update-user-role",requireAdmin, updateUserRole);

// get all users information
router.get("/get-all-users",requireAdmin, getAllUsers);

// clear user from db including admins 
router.delete("/delete-user/:id",requireAdmin, deleteUser);

export default router;
