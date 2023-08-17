import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

userSchema.methods.createAccessToken = async function () {
  return jwt.sign({ userId: this._id }, process.env.SECRET, {
    expiresIn: "1d",
  });
};

export default mongoose.model("User", userSchema);