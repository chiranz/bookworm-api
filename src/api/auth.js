import express from "express";
import User from "../models/User";

const router = express.Router();

router.post("/", (req, res) => {
  const { credentials } = req.body;
  User.findOne({ email: credentials.email }).then(user => {
    if (user && user.isValidPassword(credentials.password)) {
      res.json({ user: user.toAuthJSON() });
    } else {
      res.status(400).json({ errors: { global: "Invalid Credentials" } });
    }
  });
});

router.post("/confirmation", (req, res) => {
  const token = req.body.token;
  // find by update 3 conditions
  //1. search by token providing the confirmation token as requested above
  // 2. Fields you want to update here confirmation token and confirmed
  // 3. Third provides you with the updated record if not provided you will recieve old data
  User.findOneAndUpdate(
    { confirmationToken: token },
    { confirmationToken: "", confirmed: true },
    { new: true }
  ).then(user =>
    user
      ? res.json({ user: user.toAuthJSON() })
      : res.status(400).json({ error: { message: "Invalid token" } })
  );
});

export default router;
