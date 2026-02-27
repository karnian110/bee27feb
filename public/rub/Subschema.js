import mongoose from "mongoose";

// ----- Sub-schemas -----

const PaperSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    authors: [{ type: String, trim: true }],
    journalName: { type: String, trim: true },
    volume: { type: String, trim: true },
    year: { 
      type: Number,
      min: [1900, "Year must be 1900 or later"],
      max: [2100, "Year must be 2100 or earlier"]
    },
    summary: { type: String, trim: true },
    doi: { type: String, trim: true },
    fullPaperLink: { 
      type: String, 
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Full paper link must be a valid URL"
      }
    },
    highlights: { type: String, trim: true },
    citations: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const ResearchProfileSchema = new mongoose.Schema(
  {
    papersPublished: { type: Number, default: 0, min: 0 },
    underReview: { type: Number, default: 0, min: 0 },
    citations: { type: Number, default: 0, min: 0 },
    hIndex: { type: Number, default: 0, min: 0 },
    i10Index: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const AchievementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    issuingOrganization: { type: String, trim: true },
    description: { type: String, trim: true },
    links: [{ 
      type: String, 
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Link must be a valid URL"
      }
    }],
  },
  { _id: false }
);

const ResearchOutlookSchema = new mongoose.Schema(
  {
    googleScholarProfile: { 
      type: String, 
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Profile link must be a valid URL"
      }
    },
    researchGateProfile: { 
      type: String, 
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Profile link must be a valid URL"
      }
    },
    orcid: { 
      type: String, 
      trim: true,
      validate: {
        validator: (v) => !v || /^(https?:\/\/orcid\.org\/)?\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i.test(v),
        message: "ORCID must be a valid format (e.g., 0000-0001-2345-6789)"
      }
    },
    linkedInProfile: { 
      type: String, 
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Profile link must be a valid URL"
      }
    },
  },
  { _id: false }
);

const ContactSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Email must be a valid email address"
      }
    },
    phone: { type: String, trim: true },
    officeLocation: { type: String, trim: true },
    facebook: { 
      type: String, 
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Link must be a valid URL"
      }
    },
    twitter: { 
      type: String, 
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Link must be a valid URL"
      }
    },
    linkedIn: { 
      type: String, 
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Link must be a valid URL"
      }
    },
  },
  { _id: false }
);

const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, trim: true },
    started: { type: Date },
    completed: { type: Date },
    ongoing: { type: Boolean, default: false },
    result: { type: String, trim: true },
    location: { type: String, trim: true },
  },
  { _id: false }
);

const ProfessionalExperienceSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, trim: true },
    organization: { type: String, trim: true },
    location: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    ongoing: { type: Boolean, default: false },
    briefDescription: { type: String, trim: true },
    contributions: { type: String, trim: true },
  },
  { _id: false }
);

// ----- Export all schemas -----
export {
  PaperSchema,
  ResearchProfileSchema,
  AchievementSchema,
  ResearchOutlookSchema,
  ContactSchema,
  EducationSchema,
  ProfessionalExperienceSchema
};