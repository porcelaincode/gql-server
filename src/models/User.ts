import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    max: 100,
  },
  email: {
    type: String,
    min: 3,
    max: 255,
  },
  password: {
    type: String,
    min: 3,
    max: 255,
  },
  lastLogin: {
    type: String,
  },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
