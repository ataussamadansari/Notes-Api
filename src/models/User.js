import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
    imageId: { type: String },
    fcmToken: { type: String, default: ""}
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
