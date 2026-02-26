import mongoose from "mongoose";

// Import sub-schemas
import {
  EducationSchema,
  PaperSchema,
  ResearchProfileSchema,
  ProfessionalExperienceSchema,
  AchievementSchema,
  ResearchOutlookSchema,
  ContactSchema
} from "./Subschema.js";

// ----- Main User Schema -----
const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    profilePicture: { 
      type: String, 
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Profile picture must be a valid URL"
      }
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
      default: null
    },
    bio: { type: String, trim: true },
    fieldOfResearch: { type: String, trim: true },
    institution: { type: String, trim: true },
    education: { type: [EducationSchema], default: [] },
    papers: { type: [PaperSchema], default: [] },
    researchProfile: { type: ResearchProfileSchema, default: () => ({}) },
    expertise: [{ type: String, trim: true }],
    professionalExperience: { type: [ProfessionalExperienceSchema], default: [] },
    achievements: { type: [AchievementSchema], default: [] },
    researchOutlook: { type: ResearchOutlookSchema, default: () => ({}) },
    contact: { type: ContactSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    minimize: false,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// ----- Indexes -----
// Note: email index is automatically created by 'unique: true'
UserSchema.index({ role: 1 });
UserSchema.index({ fieldOfResearch: 1 });
UserSchema.index({ institution: 1 });
UserSchema.index({ "papers.year": -1 });
UserSchema.index({ "researchProfile.citations": -1 });
UserSchema.index({ createdAt: -1 });

// Compound index for common queries
UserSchema.index({ role: 1, fieldOfResearch: 1 });

// ----- Safe Model Export -----
const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export default User;