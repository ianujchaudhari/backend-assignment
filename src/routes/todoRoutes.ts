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

// add a new task to the list
router.post("/add", validateTodo, requireUser, createTodo);

// get the list of todos created by specific user
router.get("/", requireUser, getUserTodos);

// get list of all todos for moderators or admins only
router.get("/all", requireModerator, getAllTodos);

// update any todo date, status, description
router.put("/update/:id", validateTodo, requireUser, updateTodo);

// delete all todos only by admin
router.delete("/delete/all", requireAdmin, deleteAllTodos);

// delete any todo from the list 
router.delete("/delete/:id", requireUser, deleteTodo);


export default router;

