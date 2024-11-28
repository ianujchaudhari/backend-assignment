import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db";
import adminRoutes from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import { verifyToken } from "./middlewares/authMiddleware";
import todoRoutes from "./routes/todoRoutes";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// authentication routes tom login, logout, register, refresh token
app.use("/api/auth", authRoutes);

// middleware to verify JWT Token during request any api service
app.use(verifyToken);

// admin specific route to edit user-role, get all users and delete all users
app.use("/api/admin/", adminRoutes )

// Task management routes to add delete, update and get tasks
app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGO_URI!);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
