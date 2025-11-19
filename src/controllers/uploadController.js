import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "my_uploads" },
      (error, result) => {
        if (error) {
          console.log("Cloudinary Error:", error);
          return res.status(500).json({ message: "Upload failed" });
        }

        return res.status(200).json({
          message: "Upload successful",
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
