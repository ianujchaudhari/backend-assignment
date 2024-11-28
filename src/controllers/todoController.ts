import { Request, Response } from "express";
import Todo from "../models/Todo";

// controler to add a new todo in the Db
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const userId = (req as any).user.userId;

    const newTodo = new Todo({
      title,
      description,
      // created field is set to request user by default
      createdBy: userId,
      dueDate,
      status,
    });

    // save the new todo to the Db
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Error creating to-do" });
  }
};

// controller to update any specific todo in Db
export const updateTodo = async (req: Request, res: Response) => {
  try {
    // Get the to-do ID from the route parameters
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    // Get the user's ID from the request object
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    // Find the to-do by ID
    const todo = await Todo.findById(id);
    if (!todo) {
      res.status(404).json({ error: "To-do not found" });
      return;
    }

    // Admin and moderator can update any to-do; users can update only their own to-dos
    if (
      userRole !== "Admin" &&
      userRole !== "moderator" &&
      todo.createdBy.toString() !== userId
    ) {
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

// controller to get list of all todos in Db
export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find().populate("createdBy", "firstName lastName");
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error fetching to-dos" });
  }
};

// controller to get the user's to-do list
export const getUserTodos = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    // find list of to-do items created by the user
    const todos = await Todo.find({ createdBy: userId });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error fetching to-dos" });
  }
};

// controller to delete a todo by id
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    // fetch todo id from params and user role from user field
    const { id } = req.params;
    const userRole = (req as any).user.role;

    // check if the todo exists or not in Db
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

    // Only allow user to delete their own to-do
    if ((req as any).user.userId !== todo.createdBy.toString()) {
      res.status(403).json({ error: "Access forbidden" });
      return;
    }
    // find the specific todo in the database and delete
    await Todo.findByIdAndDelete(id);
    res.status(200).json({ message: "To-do deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting to-do" });
  }
};

// controller to delete all todoes in Db only by admin
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
