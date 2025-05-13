import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  text: { type: String, required: true, unique: true }
});

export default mongoose.model("Word", wordSchema);
