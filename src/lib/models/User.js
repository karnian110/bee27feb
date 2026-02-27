// models/User.js (or .ts if using TypeScript)
import mongoose from 'mongoose';

// ------------------- Sub-schemas -------------------

const EducationSchema = new mongoose.Schema({
    institution: { type: String, },
    degree: { type: String, },
    started: { type: Date, },
    completed: { type: Date, default: null },
    ongoing: { type: Boolean, default: false },
    result: { type: String, default: null },
    location: String
});

const PaperSchema = new mongoose.Schema({
    title: { type: String, },
    authors: [{ type: String, }],
    journalName: { type: String },
    volume: String,
    year: { type: Number, },
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

const ProfessionalExperienceSchema = new mongoose.Schema({
    jobTitle: { type: String },
    organization: { type: String },
    location: String,
    startDate: { type: Date },
    endDate: { type: Date, default: null },
    ongoing: { type: Boolean, default: false },
    briefDescription: String,
    contributions: String
});

const AchievementSchema = new mongoose.Schema({
    name: { type: String, },
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

// ------------------- Main User Schema -------------------

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: v => /^\S+@\S+\.\S+$/.test(v),
                message: 'Please provide a valid email address'
            }
        },
        profilePicture: {
            type: String,
        },
        cloudinaryPublicId: String,
        bio: String,
        fieldOfResearch: String,
        institution: String,
        title: String,
        location: String,
        username: { type: String, required: true, unique: true, trim: true },
        role: { type: String, default: 'user', enum: ['user', 'admin', 'moderator'] },
        password: { type: String, required: true, select: false },
        education: [EducationSchema],
        papers: [PaperSchema],
        researchProfile: { type: ResearchProfileSchema, default: () => ({}) },
        expertise: [String],
        professionalExperience: [ProfessionalExperienceSchema],
        achievements: [AchievementSchema],
        researchOutlook: { type: ResearchOutlookSchema, default: () => ({}) },
        contact: { type: ContactSchema, default: () => ({}) }
    },
    {
        timestamps: true
    }
);

// ------------------- Model Export -------------------
// Prevent model overwrite upon hot reload in development
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;