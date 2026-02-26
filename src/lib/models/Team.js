import mongoose from "mongoose";

// Import sub-schemas
import {
  PaperSchema,
  ResearchProfileSchema,
  AchievementSchema,
  ResearchOutlookSchema,
  ContactSchema
} from "./Subschema.js";

// ----- Member Sub-schema -----
const MemberSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { 
      type: String, 
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    role: { type: String, trim: true },
    joinedAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

// ----- Owner Sub-schema -----
const OwnerSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: "User"
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { 
      type: String, 
      required: true, 
      lowercase: true, 
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    }
  },
  { _id: false }
);

// ----- Main Team Schema -----
const TeamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    owner: { type: OwnerSchema, required: true },
    profilePicture: { 
      type: String, 
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Profile picture must be a valid URL"
      }
    },
    members: { type: [MemberSchema], default: [] },
    about: { type: String, trim: true },
    fieldOfResearch: { type: String, trim: true },
    researchProfile: { type: ResearchProfileSchema, default: () => ({}) },
    papers: { type: [PaperSchema], default: [] },
    expertise: [{ type: String, trim: true }],
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
TeamSchema.index({ "owner.email": 1 });
TeamSchema.index({ fieldOfResearch: 1 });
TeamSchema.index({ "members.email": 1 });
TeamSchema.index({ "papers.year": -1 });
TeamSchema.index({ "researchProfile.citations": -1 });
TeamSchema.index({ createdAt: -1 });

// Compound index for common queries
TeamSchema.index({ fieldOfResearch: 1, "researchProfile.citations": -1 });

// ----- Safe Model Export -----
const Team = mongoose.models?.Team || mongoose.model("Team", TeamSchema);

export default Team;