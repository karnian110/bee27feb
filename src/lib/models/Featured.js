import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [{ type: String, required: true }],
  journalName: { type: String, required: true },
  year: { type: Number, required: true },
  highlights: { type: String },
  doi: { type: String },
  fullPaperLink: { type: String },
  citations: { type: Number, default: 0 },
});

const researcherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profilePicture: { type: String },
  cloudinaryPublicId: { type: String }, // For tracking and deleting old images
  title: { type: String },
  institution: { type: String },
  bio: { type: String },
  fieldOfResearch: [{ type: String }],
  expertise: [{ type: String }],
  papersPublished: { type: Number, default: 0 },
  citations: { type: Number, default: 0 },
  hIndex: { type: Number, default: 0 },
  i10Index: { type: Number, default: 0 }
});

const featuredSchema = new mongoose.Schema({
  researcher: researcherSchema,
  papers: [paperSchema],
}, {
  timestamps: true // Add createdAt and updatedAt
});

export default mongoose.models.Featured || mongoose.model("Featured", featuredSchema);
