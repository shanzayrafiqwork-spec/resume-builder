import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
    },
    education: {
      type: String,
    },
    filePath: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);