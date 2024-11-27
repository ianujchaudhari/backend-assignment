import { Request, Response } from "express";
import Todo from "../models/Todo";

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const userId = (req as any).user.userId;

    const newTodo = new Todo({
      title,
      description,
      createdBy: userId,
      dueDate,
      status,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Error creating to-do" });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Get the to-do ID from the route parameters
    const { title, description, dueDate, status } = req.body;
    const userId = (req as any).user.userId; // Get the user's ID from the request object
    const userRole = (req as any).user.role; // Get the user's role from the request object

    // Find the to-do by ID
    const todo = await Todo.findById(id);
    if (!todo) {
      res.status(404).json({ error: "To-do not found" });
      return;
    }

    // Check permissions:
    // Admin can update any to-do; users can update only their own to-dos
    if (userRole !== "Admin" && userRole !== "moderator" && todo.createdBy.toString() !== userId) {
      res.status(403).json({
        error: "Access forbidden: You can only update your own to-dos",
      });
      return;
    }

    // Update the to-do fields if provided in the request body
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (dueDate !== undefined) todo.dueDate = new Date(dueDate);
    if (status !== undefined) todo.status = status;

    // Save the updated to-do
    const updatedTodo = await todo.save();
    res
      .status(200)
      .json({ message: "To-do updated successfully", todo: updatedTodo });
  } catch (error) {
    res.status(500).json({ error: "Error updating to-do" });
    console.log(error);
  }
};

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find().populate("createdBy", "username email");
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error fetching to-dos" });
  }
};

export const getUserTodos = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const todos = await Todo.find({ createdBy: userId });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error fetching to-dos" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = (req as any).user.role;

    const todo = await Todo.findById(id);
    if (!todo) {
      res.status(404).json({ error: "To-do not found" });
      return;
    }

    // Only allow Admin or Moderator to delete any to-do
    if (userRole === "Admin" || userRole === "moderator") {
      await Todo.findByIdAndDelete(id);
      res.status(200).json({ message: "To-do deleted" });
      return;
    }

    if ((req as any).user.userId !== todo.createdBy.toString()) {
      res.status(403).json({ error: "Access forbidden" });
      return;
    }

    await Todo.findByIdAndDelete(id);
    res.status(200).json({ message: "To-do deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting to-do" });
  }
};

export const deleteAllTodos = async (req: Request, res: Response) => {
  try {
    // Delete all to-dos
    const result = await Todo.deleteMany({});
    res.status(200).json({
      message: "All to-dos have been deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting all to-dos" });
  }
};

