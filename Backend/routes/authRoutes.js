import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  updateEmail,
  updatePassword,
  updateProfile,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);
router.patch("/profile", protect, updateProfile);
router.patch("/email", protect, updateEmail);
router.patch("/password", protect, updatePassword);

export default router;
