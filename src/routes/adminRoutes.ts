import express from "express";
import {
  updateUserRole,
  getAllUsers,
  deleteUser,
} from "../controllers/adminController";
import { requireAdmin } from "../middlewares/roleMiddleware";

const router = express.Router();

router.put("/update-user-role",requireAdmin, updateUserRole);

router.get("/get-all-users",requireAdmin, getAllUsers);

router.delete("/delete-user/:id",requireAdmin, deleteUser);

export default router;
