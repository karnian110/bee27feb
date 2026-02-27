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




const user = {
  "firstName": "Ayesha",
  "lastName": "Rahman",
  "email": "ayesha.rahman@example.com",
  "profilePicture": "https://example.com/images/ayesha.jpg",
  "cloudinaryPublicId": "users/ayesha_rahman",
  "bio": "Environmental engineer and researcher working on wastewater treatment, solid waste management, and data-driven sustainability solutions.",
  "fieldOfResearch": "Environmental Engineering",
  "institution": "University of Dhaka",
  "title": "Associate Professor",
  "location": "Dhaka, Bangladesh",
  "username": "ayesha-rahman",
  "education": [
    {
      "institution": "University of Dhaka",
      "degree": "BSc in Environmental Engineering",
      "started": "2018-01-01",
      "completed": "2022-12-01",
      "ongoing": false,
      "result": "CGPA 3.72/4.00",
      "location": "Dhaka, Bangladesh"
    },
    {
      "institution": "Asian Institute of Technology",
      "degree": "MSc in Environmental Engineering",
      "started": "2023-01-01",
      "completed": null,
      "ongoing": true,
      "result": null,
      "location": "Pathum Thani, Thailand"
    }
  ],

  "papers": [
    {
      "title": "Machine Learning Approaches for Urban Wastewater Quality Prediction",
      "authors": [
        "Ayesha Rahman",
        "M. S. Islam"
      ],
      "journalName": "Journal of Environmental Informatics",
      "volume": "15",
      "year": 2023,
      "summary": "This study applies regression and neural network models to predict influent wastewater quality parameters.",
      "doi": "10.5678/jei.2023.33445",
      "fullPaperLink": "https://journals.example.com/wastewater-ml",
      "highlights": "Data-driven modeling of BOD and COD concentrations",
      "citations": 12
    },
    {
      "title": "Assessment of Solid Waste Segregation Practices in Developing Cities",
      "authors": [
        "Ayesha Rahman",
        "T. Hossain",
        "R. Karim"
      ],
      "journalName": "Waste Management & Research",
      "volume": "11",
      "year": 2022,
      "summary": "Evaluates household-level waste segregation behavior and policy implications.",
      "doi": "10.9012/wmr.2022.77881",
      "fullPaperLink": "https://journals.example.com/solid-waste-segregation",
      "highlights": "Field surveys combined with statistical analysis",
      "citations": 21
    }
  ],

  "researchProfile": {
    "papersPublished": 2,
    "underReview": 2,
    "citations": 33,
    "hIndex": 2,
    "i10Index": 1
  },

  "expertise": [
    "Wastewater Treatment",
    "Solid Waste Management",
    "Environmental Data Analysis",
    "Machine Learning Applications",
    "Sustainability Assessment"
  ],

  "professionalExperience": [
    {
      "jobTitle": "Environmental Engineer",
      "organization": "GreenTech Consulting Ltd.",
      "location": "Dhaka, Bangladesh",
      "startDate": "2022-07-01",
      "endDate": null,
      "ongoing": true,
      "briefDescription": "Provides environmental impact assessments and wastewater system design.",
      "contributions": "Designed treatment process layouts and developed predictive monitoring models."
    },
    {
      "jobTitle": "Research Intern",
      "organization": "Center for Environmental Studies, DU",
      "location": "Dhaka, Bangladesh",
      "startDate": "2021-05-01",
      "endDate": "2021-09-01",
      "ongoing": false,
      "briefDescription": "Assisted in solid waste characterization studies.",
      "contributions": "Conducted field surveys and performed statistical data analysis."
    }
  ],

  "achievements": [
    {
      "name": "Young Researcher Award",
      "issuingOrganization": "Bangladesh Environmental Society",
      "description": "Awarded for impactful research on wastewater quality modeling.",
      "links": [
        "https://example.com/awards/young-researcher"
      ]
    },
    {
      "name": "Best Poster Presentation",
      "issuingOrganization": "International Conference on Sustainable Environment",
      "description": "Recognized for poster on machine learning in environmental monitoring.",
      "links": [
        "https://example.com/conferences/icse-poster",
        "https://news.example.com/icse-best-poster"
      ]
    }
  ],

  "researchOutlook": {
    "googleScholarProfile": "https://scholar.google.com/citations?user=xyz987",
    "researchGateProfile": "https://www.researchgate.net/profile/Ayesha-Rahman",
    "orcid": "0000-0002-9876-5432",
    "linkedInProfile": "https://www.linkedin.com/in/ayesha-rahman"
  },

  "contact": {
    "email": "ayesha.rahman@du.ac.bd",
    "phone": "+8801800000000",
    "officeLocation": "Department of Environmental Engineering, University of Dhaka",
    "facebook": "https://facebook.com/ayesha.rahman",
    "twitter": "https://twitter.com/ayesha_env",
    "linkedIn": "https://www.linkedin.com/in/ayesha-rahman"
  }
}






 const researchers = [
    {
        name: "Dr. Alex Johnson",
        profilePicture: "https://via.placeholder.com/150",
        title: "Associate Professor",
        institution: "International Tech University",
        location: "San Francisco, USA",
        bio: "AI-driven environmental solutions and smart city planning.",
        fieldOfResearch: ["Environmental Science", "Smart Cities"],
        papersPublished: 32,
        citations: 890,
        hIndex: 15,
        username: "alex-johnson",
    },
    {
        name: "Dr. Maria Gonzalez",
        profilePicture: "https://via.placeholder.com/150",
        title: "Professor",
        institution: "Global University of Technology",
        location: "Barcelona, Spain",
        bio: "Renewable energy systems and sustainable engineering.",
        fieldOfResearch: ["Renewable Energy", "Smart Grids"],
        papersPublished: 48,
        citations: 1250,
        hIndex: 22,
        username: "maria-gonzalez",
    },
    {
        name: "Dr. Liam Patel",
        profilePicture: "https://via.placeholder.com/150",
        title: "Assistant Professor",
        institution: "Metropolitan Institute of Technology",
        location: "Mumbai, India",
        bio: "Urban transportation and AI-based traffic optimization.",
        fieldOfResearch: ["Transportation", "Urban Planning"],
        papersPublished: 27,
        citations: 620,
        hIndex: 13,
        username: "liam-patel",
    },
    {
        name: "Dr. Sophie Müller",
        profilePicture: "https://via.placeholder.com/150",
        title: "Senior Researcher",
        institution: "European Institute of Environmental Studies",
        location: "Berlin, Germany",
        bio: "Climate adaptation strategies and sustainable policies.",
        fieldOfResearch: ["Climate Change", "Sustainability"],
        papersPublished: 40,
        citations: 1025,
        hIndex: 19,
        username: "sophie-muller",
    },
    {
        name: "Dr. Ethan Kim",
        profilePicture: "https://via.placeholder.com/150",
        title: "Lecturer",
        institution: "Asia-Pacific University of Science & Tech",
        location: "Seoul, South Korea",
        bio: "AI applications in water management and environmental monitoring.",
        fieldOfResearch: ["Water Resources", "AI Applications"],
        papersPublished: 22,
        citations: 450,
        hIndex: 11,
        username: "ethan-kim",
    },
    {
        name: "Dr. Sarah Chen",
        profilePicture: "https://via.placeholder.com/150",
        title: "Research Scientist",
        institution: "National Research Institute",
        location: "Singapore",
        bio: "Computational biology and bioinformatics research.",
        fieldOfResearch: ["Bioinformatics", "Genomics"],
        papersPublished: 35,
        citations: 780,
        hIndex: 16,
        username: "sarah-chen",
    },
    {
        name: "Dr. James Wilson",
        profilePicture: "https://via.placeholder.com/150",
        title: "Associate Professor",
        institution: "Cambridge Institute of Technology",
        location: "Cambridge, UK",
        bio: "Cybersecurity and privacy-preserving machine learning.",
        fieldOfResearch: ["Cybersecurity", "Privacy"],
        papersPublished: 41,
        citations: 920,
        hIndex: 18,
        username: "james-wilson",
    },
    {
        name: "Dr. Aisha Rahman",
        profilePicture: "https://via.placeholder.com/150",
        title: "Professor",
        institution: "University of Engineering & Technology",
        location: "Dhaka, Bangladesh",
        bio: "Robotics and autonomous systems for industrial applications.",
        fieldOfResearch: ["Robotics", "Automation"],
        papersPublished: 55,
        citations: 1580,
        hIndex: 25,
        username: "aisha-rahman",
    },
];



const researchTeams = [
    {
        teamName: "AI for Sustainability",
        owner: "Dr. Alex Johnson",
        profilePicture: "https://via.placeholder.com/150",
        moto: "Innovating for a greener future",
        about: "We develop AI-driven solutions for environmental challenges, focusing on smart city planning and sustainable urban development.",
        fieldOfResearch: ["Environmental Science", "Smart Cities", "AI/ML"],
        memberCount: 8,
        papersPublished: 32,
        id: "ai-sustainability",
    },
    {
        teamName: "Climate Resilience Lab",
        owner: "Dr. Jane Smith",
        profilePicture: "https://via.placeholder.com/150",
        moto: "Building resilient communities",
        moto: "Building resilient communities",
        about: "Predictive modeling for climate-resilient urban infrastructure and sustainable engineering solutions.",
        fieldOfResearch: ["Environmental Engineering", "Urban Analytics", "Climate Modeling"],
        memberCount: 12,
        papersPublished: 45,
        id: "climate-resilience",
    },
    {
        teamName: "Geotech Modeling Group",
        owner: "Dr. Michael Lee",
        profilePicture: "https://via.placeholder.com/150",
        moto: "Engineering the earth beneath us",
        about: "Advanced numerical modeling and geotechnical risk assessment for complex infrastructure projects.",
        fieldOfResearch: ["Geotechnical Engineering", "Numerical Modeling", "Risk Assessment"],
        memberCount: 10,
        papersPublished: 58,
        id: "geotech-modeling",
    },
    {
        teamName: "ML for Climate Adaptation",
        owner: "Dr. Emily Wong",
        profilePicture: "https://via.placeholder.com/150",
        moto: "Data-driven climate solutions",
        about: "Machine learning applications for climate adaptation, resilience planning, and environmental monitoring.",
        fieldOfResearch: ["Climate Science", "Machine Learning", "Data Analytics"],
        memberCount: 6,
        papersPublished: 27,
        id: "ml-climate",
    },
];