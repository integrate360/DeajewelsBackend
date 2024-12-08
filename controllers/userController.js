const bcrypt = require("bcryptjs");
const User = require("../models/User");
const mongoose = require("mongoose");
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const otps = {}; // Store OTPs

const sendOtp = async (phoneNumber, otp) => {
  console.log(`Sending OTP ${otp} to ${phoneNumber}`);
  // You can integrate your SMS service here
};

const registerUser = async (req, res) => {
  try {
    const { phoneNumber, username } = req.body;
    const normalizedPhoneNumber = phoneNumber.trim();

    const existingUser = await User.findOne({
      $or: [{ phoneNumber: normalizedPhoneNumber }, { username }],
    });

    if (existingUser) {
      if (existingUser.phoneNumber === normalizedPhoneNumber) {
        return res
          .status(400)
          .json({ message: "User with this phone number already exists" });
      } else if (existingUser.username === username) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    const otp = generateOtp();
    await sendOtp(normalizedPhoneNumber, otp);
    otps[normalizedPhoneNumber] = { otp, username }; // Store OTP and username
    console.log("Stored OTP:", otps[normalizedPhoneNumber]);

    res.status(200).json({ message: "OTP sent successfully. Please verify.", otp });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ message: "Failed to register user" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const normalizedPhoneNumber = phoneNumber.trim();
    if (otps[normalizedPhoneNumber] && otps[normalizedPhoneNumber].otp === otp.trim()) {
      const username = otps[normalizedPhoneNumber].username;
      let existingUser = await User.findOne({ phoneNumber: normalizedPhoneNumber });
      if (!existingUser) {
        existingUser = new User({
          phoneNumber: normalizedPhoneNumber,
          username,
        });
        await existingUser.save();
      }
      delete otps[normalizedPhoneNumber];

      return res.status(200).json({ message: "OTP verified successfully", user: existingUser });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Error during OTP verification:", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Check if the user exists in the database
    const existingUser = await User.findOne({ phoneNumber });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new OTP
    const otp = generateOtp();
    await sendOtp(phoneNumber, otp);
    otps[phoneNumber] = { otp }; // Store OTP as an object for consistency

    res.status(200).json({ message: "OTP sent successfully. Please verify.",otp });
  } catch (err) {
    console.error("Error during OTP login:", err);
    res.status(500).json({ message: "Failed to initiate OTP login" });
  }
};

const verifyOtpLogin = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (otps[phoneNumber] && otps[phoneNumber] === otp) {
      delete otps[phoneNumber];

      res
        .status(200)
        .json({ message: "Login successful", userId: phoneNumber });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Error during OTP verification:", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body }; 
    const files = req.files; 

    if (files && files.length > 0) {
      console.log("Image files found, uploading...");
      const imageUrls = files.map((file) => `/uploads/${file.filename}`); 
      updates.images = imageUrls;
    }
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true, 
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating User:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update User",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error.message, error.stack);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  verifyOtpLogin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
