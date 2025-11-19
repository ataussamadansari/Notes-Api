import userModel from "../models/User.js";
import admin from "../config/firebase.js";

export const sendNotification = async (req, res) => {
  try {
    const { userId, title, body } = req.body;

    const user = await userModel.findByid(userId);
    if (!user || !user.fcmToken)
      return res.status(404).json({ message: "User or token not found" });

    const message = {
      token: user.fcmToken,
      notification: { title, body },
    };

    await admin.messaging().send(message);

    res.json({ message: "Notification Sent!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error sending notification" });
  }
};
