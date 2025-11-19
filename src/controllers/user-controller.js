import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt_token.js";
import cloudinary from "../config/cloudinary.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Existing User Check
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Upload Image First (if provided)
    let imageUrl = null;
    let publicId = null;

    if(req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "users" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        upload.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    // Hashed Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // User Creation
    const result = await userModel.create({
      username: username,
      email: email,
      password: hashedPassword,
      image: imageUrl,
      imageId: publicId,
    });

    // Token Generate
    const token = generateToken(result);

    res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Existing User Check
    const existingUser = await userModel.findOne({ email: email }).select("-imageId");
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }

    // Password bycrypt compare
    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // Token Generate
    const token = generateToken(existingUser);

    res.status(200).json({ user: existingUser, token: token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const getProfile = async (req, res) => {
    const { id } = req.user;

    try {
        const existingUser = await userModel.findById(id).select("-password -imageId");
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: existingUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    // Find User
    const user = await userModel.findById(userId);
    if(!user) return res.status(404).json({ message: "User not found!" });
    
    let newImageUrl = user.image;
    let newImageId = user.imageId;

    if(req.file) {
      // Delete old Image from Cloudinary
      if(user.imageId) {
        try {
          await cloudinary.uploader.destroy(user.imageId);
        } catch (error) {
          console.log("Cloudinary delete error: ", error);
        }
      }

      // Upload new image
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "users" },
          (error, result) => {
            if(error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      newImageUrl = uploadResult.secure_url;
      newImageId = uploadResult.public_id;
    }

    // Update User
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        username: username || user.username,
        email: email || user.email,
        image: newImageUrl,
        imageId: newImageId
      },
      { new: true }
    ).select("-password -imageId");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.log("Update profile error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const saveToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fcmToken } = req.body;

    if(!userId || !fcmToken) 
      return res.status(400).json({ message: "Missing userId or fcmToken "});

    const user = await userModel.findByIdAndUpdate(
      userId,
      { fcmToken },
      { new: true }
    )

    return res.json({ message: "Token saved", user });
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
};