import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    max: 255,
  },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
