import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/authController";
import validateRegistrationInput from "../middlewares/validateRegistrationInput";

const router = express.Router();

// route register a new user, only users and register to application 
router.post("/register", validateRegistrationInput, register);

// login route
router.post("/login", login);

// refresh token route to get new access token
router.post("/refresh-token", refreshToken);

// logout route
router.post("/logout", logout);

export default router;


