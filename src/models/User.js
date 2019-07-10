import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";

// TODO: Add uniqueness and validations
const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      useCreateIndex: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    confirmed: { type: Boolean, default: false },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

schema.plugin(uniqueValidator, { message: "This {PATH} is already taken." });

schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email
    },
    process.env.JWT_SECRET
  );
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    token: this.generateJWT(),
    confirmed: this.confirmed,
    username: this.username
  };
};

export default mongoose.model("User", schema);
