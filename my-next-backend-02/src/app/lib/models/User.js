import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  profileImage: String, // We will store the URL path to the image here
});

export default mongoose.models.User || mongoose.model("User", UserSchema);