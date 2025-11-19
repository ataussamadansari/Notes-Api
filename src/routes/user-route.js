import express from 'express';
import { getProfile, login, register, saveToken, updateProfile } from '../controllers/user-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import { upload } from '../config/multer.js';
const user = express.Router();

user.post('/register', upload.single("image"), register);
user.post('/login', login);
user.post('/save-token', authMiddleware, saveToken);
user.get('/profile', authMiddleware, getProfile);
user.put("/update-profile", authMiddleware, upload.single("image"), updateProfile);

export default user;