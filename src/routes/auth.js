import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "../mailer";

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
router.post("/reset_password_request", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      sendResetPasswordEmail(user);
      res.json({});
    } else {
      res.status(400).json({ errors: { global: "Email not found!" } });
    }
  });
});
router.post("/validate_token", (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET, err => {
    if (err) {
      res.status(401).json({});
    } else {
      res.json({});
    }
  });
});
router.post("/reset_password", (req, res) => {
  const { token, password } = req.body.data;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ errors: { global: "Invalid token" } });
    } else {
      User.findOne({ _id: decoded._id }).then(user => {
        if (user) {
          user.setPassword(password);
          user.save().then(() => res.json({}));
        } else {
          res.status(404).json({ errors: { global: "Invalid token." } });
        }
      });
    }
  });
});

export default router;
