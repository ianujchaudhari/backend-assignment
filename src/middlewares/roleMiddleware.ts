import { Request, Response, NextFunction } from "express";

// index of array defines level of priority from lowest to heighest
const roleHierarchy = ["user", "moderator", "admin"];

// Helper function to check if the user role meets the minimum required role based on array index
function hasAccess(userRole: string, minimumRole: string): boolean {
  const userIndex = roleHierarchy.indexOf(userRole.toLowerCase());
  const minRoleIndex = roleHierarchy.indexOf(minimumRole.toLowerCase());
  return userIndex >= minRoleIndex;
}

// Middleware to check for minimum role of User
export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRole = (req as any).user?.role?.toLowerCase();
  if (!userRole) {
    res.status(401).json({ errors: "Unauthorized: No role found" });
    return;
  }
  if (hasAccess(userRole, "user")) {
    return next();
  }
  res.status(403).json({ error: "Access forbidden: User or higher required" });
};

// Middleware to check for minimum role of Moderator
export const requireModerator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRole = (req as any).user?.role?.toLowerCase();
  if (!userRole) {
    res.status(401).json({ errors: "Unauthorized: No role found" });
    return;
  }
  if (hasAccess(userRole, "moderator")) {
    return next();
  }
  res
    .status(403)
    .json({ error: "Access forbidden: Moderator or higher required" });
};

// Middleware to check for minimum role of Admin
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRole = (req as any).user?.role?.toLowerCase();
  if (!userRole) {
    res.status(401).json({ errors: "Unauthorized: No role found" });
    return;
  }
  if (hasAccess(userRole, "admin")) {
    return next();
  }
  res.status(403).json({ error: "Access forbidden: Admin required" });
};
