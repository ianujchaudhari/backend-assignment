import express from "express";
import {
  createTodo,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
  getAllTodos,
  getUserTodos,
} from "../controllers/todoController";
import { validateTodo } from "../middlewares/validateTodo";
import {
  requireAdmin,
  requireUser,
  requireModerator,
} from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/add", validateTodo, requireUser, createTodo);

router.get("/", requireUser, getUserTodos);

router.get("/all", requireModerator, getAllTodos);

router.put("/update/:id", validateTodo, requireUser, updateTodo);

router.delete("/delete/all", requireAdmin, deleteAllTodos);

router.delete("/delete/:id", requireUser, deleteTodo);


export default router;

