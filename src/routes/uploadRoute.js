import express from "express";
import { upload } from "../config/multer.js";
import { uploadImage } from "../controllers/uploadController.js";

const uploadRoutes = express.Router();

uploadRoutes.post('/upload', upload.single("image"), uploadImage);

export default uploadRoutes;