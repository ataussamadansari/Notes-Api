import express from "express";
import mongoose from "mongoose";
import user from "./routes/user-route.js";
import notes from "./routes/note-route.js";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoute.js";
import notificationRouter from "./routes/notification-routes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", user);
app.use("/api/notes", notes);
app.use("/api/notification/", notificationRouter);
app.use("/api/image", uploadRoutes)

app.get("/api", (req, res) => {
  res.send("Api is working");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
