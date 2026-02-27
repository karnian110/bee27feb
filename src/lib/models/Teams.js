import mongoose from 'mongoose';

// ------------------- Sub-schemas (all fields optional) -------------------

const PaperSchema = new mongoose.Schema({
  title: String,
  authors: [String],
  journalName: String,
  volume: String,
  year: Number,
  summary: String,
  doi: String,
  fullPaperLink: {
    type: String,
    validate: {
      validator: v => !v || /^https?:\/\/.+/.test(v),
      message: 'Invalid URL format for fullPaperLink'
    }
  },
  highlights: String,
  citations: { type: Number, default: 0 }
});

const ResearchProfileSchema = new mongoose.Schema({
  papersPublished: { type: Number, default: 0 },
  underReview: { type: Number, default: 0 },
  citations: { type: Number, default: 0 },
  hIndex: { type: Number, default: 0 },
  i10Index: { type: Number, default: 0 }
});

const AchievementSchema = new mongoose.Schema({
  name: String,
  issuingOrganization: String,
  description: String,
  links: [{
    type: String,
    validate: {
      validator: v => !v || /^https?:\/\/.+/.test(v),
      message: 'Invalid URL format in achievement link'
    }
  }]
});

const ResearchOutlookSchema = new mongoose.Schema({
  googleScholarProfile: {
    type: String,
    validate: {
      validator: v => !v || /^https?:\/\/.+/.test(v),
      message: 'Invalid URL for Google Scholar'
    }
  },
  researchGateProfile: {
    type: String,
    validate: {
      validator: v => !v || /^https?:\/\/.+/.test(v),
      message: 'Invalid URL for ResearchGate'
    }
  },
  orcid: {
    type: String,
    validate: {
      validator: v => !v || /^0000-000(1-[5-9]|2-[0-9]|3-[0-4])\d{3}-\d{3}[\dX]$/.test(v),
      message: 'Invalid ORCID format (expected 0000-0002-9876-5432)'
    }
  },
  linkedInProfile: {
    type: String,
    validate: {
      validator: v => !v || /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(v),
      message: 'Invalid LinkedIn URL'
    }
  }
});

const ContactSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: v => !v || /^\S+@\S+\.\S+$/.test(v),
      message: 'Invalid email format in contact'
    }
  },
  phone: String,
  officeLocation: String,
  facebook: {
    type: String,
    validate: {
      validator: v => !v || /^https?:\/\/(www\.)?facebook\.com\/.+/.test(v),
      message: 'Invalid Facebook URL'
    }
  },
  twitter: {
    type: String,
    validate: {
      validator: v => !v || /^https?:\/\/(www\.)?twitter\.com\/.+/.test(v),
      message: 'Invalid Twitter URL'
    }
  },
  linkedIn: {
    type: String,
    validate: {
      validator: v => !v || /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(v),
      message: 'Invalid LinkedIn URL'
    }
  }
});

// ------------------- Main Team Schema -------------------

const LabSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true, trim: true },
    moto: { type: String, trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    profilePicture: {
      type: String,
      validate: {
        validator: v => !v || /^https?:\/\/.+/.test(v),
        message: 'Invalid URL for profile picture'
      }
    },
    cloudinaryPublicId: String,
    about: String,
    fieldOfResearch: String,
    researchProfile: { type: ResearchProfileSchema, default: () => ({}) },
    papers: [PaperSchema],
    expertise: [String],
    achievements: [AchievementSchema],
    researchOutlook: { type: ResearchOutlookSchema, default: () => ({}) },
    contact: { type: ContactSchema, default: () => ({}) },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: v => !v || /^\S+@\S+\.\S+$/.test(v),
        message: 'Invalid email format for lab email'
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for member count
LabSchema.virtual('memberCount').get(function() {
  return this.members?.length || 0;
});

// ------------------- Model Export -------------------
const Team = mongoose.models.Team || mongoose.model('Team', LabSchema);

export default Team;