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

app.use("/api/auth", authRoutes);

app.use(verifyToken);

app.use("/api/admin/", adminRoutes )

app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5001;
connectDB(process.env.MONGO_URI!);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
