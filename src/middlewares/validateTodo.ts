import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateTodo = [
  // Title validation
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ max: 100 })
    .withMessage("Title must not exceed 100 characters"),

  // Description validation
  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  // Due date validation (optional)
  check("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO8601 date"),

  // Status validation (optional)
  check("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage(
      "Status must be one of 'pending', 'in-progress', or 'completed'"
    ),

  // Middleware to handle validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];
