import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  avatarOptions,
  isStrongPassword,
  isValidEmail,
  isValidUsername,
  normalizeEmail,
  normalizeUsername,
  publicUser,
} from "../utils/validators.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedName = normalizeUsername(name);
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidUsername(normalizedName)) {
      return res.status(400).json({
        message:
          "Username must be 3-30 characters and start with a letter",
      });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ characters with uppercase, lowercase, number, and symbol",
      });
    }

    const userExists = await User.findOne({
      $or: [{ email: normalizedEmail }, { name: normalizedName }],
    });

    if (userExists) {
      return res.status(400).json({
        message:
          userExists.email === normalizedEmail
            ? "Email already exists"
            : "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  res.status(200).json(publicUser(req.user));
};

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};

    if (name !== undefined) {
      const normalizedName = normalizeUsername(name);

      if (!isValidUsername(normalizedName)) {
        return res.status(400).json({
          message:
            "Username must be 3-30 characters and start with a letter",
        });
      }

      const existingUser = await User.findOne({
        name: normalizedName,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      updates.name = normalizedName;
    }

    if (avatar !== undefined) {
      if (!avatarOptions.includes(avatar)) {
        return res.status(400).json({ message: "Invalid avatar option" });
      }

      updates.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);

    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email: normalizedEmail },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      message: "Email updated successfully",
      user: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:
          "New password must be 8+ characters with uppercase, lowercase, number, and symbol",
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
