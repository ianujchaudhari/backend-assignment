import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "backend_assignment_jwt_secret";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res
      .status(401)
      .json({ error: "No token provided or invalid token format." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      role: string;
    };

    // Ensure token contains the required claims
    if (!decoded.userId || !decoded.role) {
      res.status(400).json({ error: "Invalid token payload." });
      return;
    }

    // Attach user data to request, including companyId
    (req as any).user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: "Token expired. Please log in again." });
      return;
    }
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Invalid token. Please log in again." });
      return;
    }
    res.status(500).json({ error: "Authentication error." });
    return;
  }
};
