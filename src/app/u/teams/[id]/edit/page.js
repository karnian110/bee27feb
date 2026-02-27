"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  Users,
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Upload,
  X,
  Plus,
  Search,
  Trash2,
  Crown,
  UserPlus,
  Check,
  BookOpen,
  Award,
  Globe,
  Contact,
  BarChart3,
  Link2,
  FileText,
  Edit,
} from "lucide-react";

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

export default function EditTeam() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    teamName: "",
    moto: "",
    email: "",
    about: "",
    fieldOfResearch: "",
    profilePicture: "",
    cloudinaryPublicId: "",
    expertise: "",
    members: [],
    // Research Profile
    researchProfile: {
      papersPublished: 0,
      underReview: 0,
      citations: 0,
      hIndex: 0,
      i10Index: 0,
    },
    // Papers
    papers: [],
    // Achievements
    achievements: [],
    // Research Outlook
    researchOutlook: {
      googleScholarProfile: "",
      researchGateProfile: "",
      orcid: "",
      linkedInProfile: "",
    },
    // Contact
    contact: {
      email: "",
      phone: "",
      officeLocation: "",
      facebook: "",
      twitter: "",
      linkedIn: "",
    },
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Member search
  const [memberSearch, setMemberSearch] = useState("");
  const [memberResults, setMemberResults] = useState([]);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const memberInputRef = useRef(null);
  
  // Paper form
  const [showPaperForm, setShowPaperForm] = useState(false);
  const [paperForm, setPaperForm] = useState({
    title: "",
    authors: "",
    journalName: "",
    volume: "",
    year: new Date().getFullYear(),
    summary: "",
    doi: "",
    fullPaperLink: "",
    highlights: "",
    citations: 0,
  });
  const [editingPaperIndex, setEditingPaperIndex] = useState(null);

  // Achievement form
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [achievementForm, setAchievementForm] = useState({
    name: "",
    issuingOrganization: "",
    description: "",
    links: "",
  });
  const [editingAchievementIndex, setEditingAchievementIndex] = useState(null);
  
  const debouncedMemberSearch = useDebounce(memberSearch, 300);

  // Fetch team data
  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  // Search for members
  useEffect(() => {
    if (debouncedMemberSearch.length >= 2) {
      searchUsers(debouncedMemberSearch);
      setShowMemberDropdown(true);
    } else {
      setMemberResults([]);
      setShowMemberDropdown(false);
    }
  }, [debouncedMemberSearch]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (memberInputRef.current && !memberInputRef.current.contains(e.target)) {
        setShowMemberDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (res.status === 403) {
          setError("You don't have permission to edit this team");
          return;
        }
        throw new Error("Failed to fetch team");
      }
      
      const data = await res.json();
      const team = data.team;
      
      setFormData({
        teamName: team.teamName || "",
        moto: team.moto || "",
        email: team.email || "",
        about: team.about || "",
        fieldOfResearch: team.fieldOfResearch || "",
        profilePicture: team.profilePicture || "",
        cloudinaryPublicId: team.cloudinaryPublicId || "",
        expertise: Array.isArray(team.expertise) ? team.expertise.join(", ") : "",
        members: team.members || [],
        researchProfile: team.researchProfile || {
          papersPublished: 0,
          underReview: 0,
          citations: 0,
          hIndex: 0,
          i10Index: 0,
        },
        papers: team.papers || [],
        achievements: team.achievements || [],
        researchOutlook: team.researchOutlook || {
          googleScholarProfile: "",
          researchGateProfile: "",
          orcid: "",
          linkedInProfile: "",
        },
        contact: team.contact || {
          email: "",
          phone: "",
          officeLocation: "",
          facebook: "",
          twitter: "",
          linkedIn: "",
        },
      });
      
      setPreviewImage(team.profilePicture || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.users) {
        setMemberResults(data.users);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const addMember = (user) => {
    if (!formData.members.find(m => m._id === user._id)) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, user]
      }));
    }
    setMemberSearch("");
    setShowMemberDropdown(false);
  };

  const removeMember = (userId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m._id !== userId)
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPG, PNG, GIF, WEBP allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Max size is 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(file);

    setUploadingImage(true);
    setError("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("folder", "teams");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      // Delete old image if exists
      if (formData.cloudinaryPublicId) {
        await fetch(`/api/upload?publicId=${formData.cloudinaryPublicId}`, {
          method: "DELETE",
        });
      }

      setFormData(prev => ({
        ...prev,
        profilePicture: data.url,
        cloudinaryPublicId: data.publicId,
      }));

      setPreviewImage(data.url);
      setSuccess("Image uploaded successfully!");
    } catch (err) {
      setError("Error uploading image: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Paper handlers
  const handlePaperFormChange = (e) => {
    const { name, value } = e.target;
    setPaperForm(prev => ({ ...prev, [name]: value }));
  };

  const savePaper = () => {
    if (!paperForm.title.trim()) return;
    
    const paperData = {
      ...paperForm,
      authors: paperForm.authors.split(",").map(s => s.trim()).filter(Boolean),
      year: parseInt(paperForm.year) || new Date().getFullYear(),
      citations: parseInt(paperForm.citations) || 0,
    };

    if (editingPaperIndex !== null) {
      // Update existing
      setFormData(prev => ({
        ...prev,
        papers: prev.papers.map((p, i) => i === editingPaperIndex ? paperData : p),
      }));
    } else {
      // Add new
      setFormData(prev => ({
        ...prev,
        papers: [...prev.papers, paperData],
      }));
    }

    resetPaperForm();
  };

  const resetPaperForm = () => {
    setPaperForm({
      title: "",
      authors: "",
      journalName: "",
      volume: "",
      year: new Date().getFullYear(),
      summary: "",
      doi: "",
      fullPaperLink: "",
      highlights: "",
      citations: 0,
    });
    setShowPaperForm(false);
    setEditingPaperIndex(null);
  };

  const editPaper = (index) => {
    const paper = formData.papers[index];
    setPaperForm({
      ...paper,
      authors: Array.isArray(paper.authors) ? paper.authors.join(", ") : paper.authors,
    });
    setEditingPaperIndex(index);
    setShowPaperForm(true);
  };

  const deletePaper = (index) => {
    setFormData(prev => ({
      ...prev,
      papers: prev.papers.filter((_, i) => i !== index),
    }));
  };

  // Achievement handlers
  const handleAchievementFormChange = (e) => {
    const { name, value } = e.target;
    setAchievementForm(prev => ({ ...prev, [name]: value }));
  };

  const saveAchievement = () => {
    if (!achievementForm.name.trim()) return;
    
    const achievementData = {
      ...achievementForm,
      links: achievementForm.links.split("\n").map(s => s.trim()).filter(Boolean),
    };

    if (editingAchievementIndex !== null) {
      setFormData(prev => ({
        ...prev,
        achievements: prev.achievements.map((a, i) => i === editingAchievementIndex ? achievementData : a),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementData],
      }));
    }

    resetAchievementForm();
  };

  const resetAchievementForm = () => {
    setAchievementForm({
      name: "",
      issuingOrganization: "",
      description: "",
      links: "",
    });
    setShowAchievementForm(false);
    setEditingAchievementIndex(null);
  };

  const editAchievement = (index) => {
    const achievement = formData.achievements[index];
    setAchievementForm({
      ...achievement,
      links: Array.isArray(achievement.links) ? achievement.links.join("\n") : achievement.links,
    });
    setEditingAchievementIndex(index);
    setShowAchievementForm(true);
  };

  const deleteAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        teamName: formData.teamName,
        moto: formData.moto,
        email: formData.email,
        about: formData.about,
        fieldOfResearch: formData.fieldOfResearch,
        profilePicture: formData.profilePicture,
        cloudinaryPublicId: formData.cloudinaryPublicId,
        expertise: formData.expertise.split(",").map(s => s.trim()).filter(Boolean),
        members: formData.members.map(m => m._id),
        researchProfile: formData.researchProfile,
        papers: formData.papers,
        achievements: formData.achievements,
        researchOutlook: formData.researchOutlook,
        contact: formData.contact,
      };

      const res = await fetch(`/api/teams/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update team");
      }

      setSuccess("Team updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "TE";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#950E1D]" />
          <span className="text-slate-600">Loading team...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/u/my-teams"
            className="inline-flex items-center text-sm text-slate-500 hover:text-[#950E1D] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to My Teams
          </Link>
          <h1 className="text-3xl font-bold text-[#1B263B]">Edit Team</h1>
          <p className="text-slate-500 mt-1">
            Update your team information and manage members
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
            <Check className="w-5 h-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Image & Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-[#1B263B] mb-6 flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#950E1D]" />
              Basic Information
            </h2>

            {/* Image Upload */}
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Team"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                      {getInitials(formData.teamName)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Team Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium">
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                    />
                  </label>
                  {uploadingImage && <Loader2 className="w-5 h-5 animate-spin text-[#950E1D]" />}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Max size: 5MB. JPG, PNG, GIF, WEBP
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="teamName" className="block text-sm font-medium text-slate-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="moto" className="block text-sm font-medium text-slate-700 mb-2">
                  Team Motto
                </label>
                <input
                  type="text"
                  id="moto"
                  name="moto"
                  value={formData.moto}
                  onChange={handleChange}
                  placeholder="A short inspirational quote or motto"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Team Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="fieldOfResearch" className="block text-sm font-medium text-slate-700 mb-2">
                  Field of Research
                </label>
                <input
                  type="text"
                  id="fieldOfResearch"
                  name="fieldOfResearch"
                  value={formData.fieldOfResearch}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="expertise" className="block text-sm font-medium text-slate-700 mb-2">
                  Expertise (comma-separated)
                </label>
                <input
                  type="text"
                  id="expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  placeholder="e.g., Machine Learning, AI, Data Science"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="about" className="block text-sm font-medium text-slate-700 mb-2">
                  About
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Research Profile */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-[#1B263B] mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#950E1D]" />
              Research Profile
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Papers Published
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.researchProfile.papersPublished}
                  onChange={(e) => handleNestedChange("researchProfile", "papersPublished", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Under Review
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.researchProfile.underReview}
                  onChange={(e) => handleNestedChange("researchProfile", "underReview", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Citations
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.researchProfile.citations}
                  onChange={(e) => handleNestedChange("researchProfile", "citations", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  H-Index
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.researchProfile.hIndex}
                  onChange={(e) => handleNestedChange("researchProfile", "hIndex", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  i10-Index
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.researchProfile.i10Index}
                  onChange={(e) => handleNestedChange("researchProfile", "i10Index", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Research Outlook */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-[#1B263B] mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#950E1D]" />
              Research Outlook & Profiles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Google Scholar Profile
                </label>
                <input
                  type="url"
                  value={formData.researchOutlook.googleScholarProfile}
                  onChange={(e) => handleNestedChange("researchOutlook", "googleScholarProfile", e.target.value)}
                  placeholder="https://scholar.google.com/citations?..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ResearchGate Profile
                </label>
                <input
                  type="url"
                  value={formData.researchOutlook.researchGateProfile}
                  onChange={(e) => handleNestedChange("researchOutlook", "researchGateProfile", e.target.value)}
                  placeholder="https://www.researchgate.net/profile/..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ORCID
                </label>
                <input
                  type="text"
                  value={formData.researchOutlook.orcid}
                  onChange={(e) => handleNestedChange("researchOutlook", "orcid", e.target.value)}
                  placeholder="0000-0002-1234-5678"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={formData.researchOutlook.linkedInProfile}
                  onChange={(e) => handleNestedChange("researchOutlook", "linkedInProfile", e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-[#1B263B] mb-6 flex items-center gap-2">
              <Contact className="w-5 h-5 text-[#950E1D]" />
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleNestedChange("contact", "email", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => handleNestedChange("contact", "phone", e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Office Location
                </label>
                <input
                  type="text"
                  value={formData.contact.officeLocation}
                  onChange={(e) => handleNestedChange("contact", "officeLocation", e.target.value)}
                  placeholder="Building, Room, Address..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={formData.contact.facebook}
                  onChange={(e) => handleNestedChange("contact", "facebook", e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.contact.twitter}
                  onChange={(e) => handleNestedChange("contact", "twitter", e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.contact.linkedIn}
                  onChange={(e) => handleNestedChange("contact", "linkedIn", e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Papers Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#1B263B] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#950E1D]" />
                Papers & Publications ({formData.papers.length})
              </h2>
              <button
                type="button"
                onClick={() => setShowPaperForm(true)}
                className="inline-flex items-center px-3 py-1.5 bg-[#950E1D]/10 text-[#950E1D] rounded-lg hover:bg-[#950E1D]/20 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Paper
              </button>
            </div>

            {/* Paper Form */}
            {showPaperForm && (
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-medium text-slate-900 mb-4">
                  {editingPaperIndex !== null ? "Edit Paper" : "Add New Paper"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={paperForm.title}
                      onChange={handlePaperFormChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Authors (comma-separated)</label>
                    <input
                      type="text"
                      name="authors"
                      value={paperForm.authors}
                      onChange={handlePaperFormChange}
                      placeholder="John Doe, Jane Smith"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Journal Name</label>
                    <input
                      type="text"
                      name="journalName"
                      value={paperForm.journalName}
                      onChange={handlePaperFormChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Volume</label>
                    <input
                      type="text"
                      name="volume"
                      value={paperForm.volume}
                      onChange={handlePaperFormChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                    <input
                      type="number"
                      name="year"
                      value={paperForm.year}
                      onChange={handlePaperFormChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Citations</label>
                    <input
                      type="number"
                      name="citations"
                      value={paperForm.citations}
                      onChange={handlePaperFormChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">DOI</label>
                    <input
                      type="text"
                      name="doi"
                      value={paperForm.doi}
                      onChange={handlePaperFormChange}
                      placeholder="10.xxxx/xxxxx"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Paper Link</label>
                    <input
                      type="url"
                      name="fullPaperLink"
                      value={paperForm.fullPaperLink}
                      onChange={handlePaperFormChange}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Summary</label>
                    <textarea
                      name="summary"
                      value={paperForm.summary}
                      onChange={handlePaperFormChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Highlights</label>
                    <input
                      type="text"
                      name="highlights"
                      value={paperForm.highlights}
                      onChange={handlePaperFormChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetPaperForm}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={savePaper}
                    className="px-4 py-2 bg-[#950E1D] text-white rounded-lg hover:bg-[#7a0c18] transition-colors"
                  >
                    {editingPaperIndex !== null ? "Update" : "Add"} Paper
                  </button>
                </div>
              </div>
            )}

            {/* Papers List */}
            {formData.papers.length === 0 ? (
              <div className="p-8 bg-slate-50 rounded-xl text-center">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">No papers added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.papers.map((paper, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">{paper.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">
                          {Array.isArray(paper.authors) ? paper.authors.join(", ") : paper.authors} • {paper.journalName} • {paper.year}
                        </p>
                        {paper.citations > 0 && (
                          <span className="inline-flex items-center mt-2 text-xs text-slate-600">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            {paper.citations} citations
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          type="button"
                          onClick={() => editPaper(index)}
                          className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePaper(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievements Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#1B263B] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#950E1D]" />
                Achievements ({formData.achievements.length})
              </h2>
              <button
                type="button"
                onClick={() => setShowAchievementForm(true)}
                className="inline-flex items-center px-3 py-1.5 bg-[#950E1D]/10 text-[#950E1D] rounded-lg hover:bg-[#950E1D]/20 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Achievement
              </button>
            </div>

            {/* Achievement Form */}
            {showAchievementForm && (
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-medium text-slate-900 mb-4">
                  {editingAchievementIndex !== null ? "Edit Achievement" : "Add New Achievement"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={achievementForm.name}
                      onChange={handleAchievementFormChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Issuing Organization</label>
                    <input
                      type="text"
                      name="issuingOrganization"
                      value={achievementForm.issuingOrganization}
                      onChange={handleAchievementFormChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={achievementForm.description}
                      onChange={handleAchievementFormChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Links (one per line)
                    </label>
                    <textarea
                      name="links"
                      value={achievementForm.links}
                      onChange={handleAchievementFormChange}
                      rows={2}
                      placeholder="https://example.com/award1&#10;https://example.com/award2"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetAchievementForm}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveAchievement}
                    className="px-4 py-2 bg-[#950E1D] text-white rounded-lg hover:bg-[#7a0c18] transition-colors"
                  >
                    {editingAchievementIndex !== null ? "Update" : "Add"} Achievement
                  </button>
                </div>
              </div>
            )}

            {/* Achievements List */}
            {formData.achievements.length === 0 ? (
              <div className="p-8 bg-slate-50 rounded-xl text-center">
                <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">No achievements added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900">{achievement.name}</h4>
                        {achievement.issuingOrganization && (
                          <p className="text-sm text-slate-500 mt-1">{achievement.issuingOrganization}</p>
                        )}
                        {achievement.description && (
                          <p className="text-sm text-slate-600 mt-2">{achievement.description}</p>
                        )}
                        {achievement.links && achievement.links.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {achievement.links.map((link, i) => (
                              <a
                                key={i}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-[#950E1D] hover:underline"
                              >
                                <Link2 className="w-3 h-3 mr-1" />
                                Link {i + 1}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          type="button"
                          onClick={() => editAchievement(index)}
                          className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAchievement(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Members Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-[#1B263B] mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#950E1D]" />
              Team Members
            </h2>

            {/* Add Members Search */}
            <div className="mb-6" ref={memberInputRef}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Add Members
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  onFocus={() => memberSearch.length >= 2 && setShowMemberDropdown(true)}
                  placeholder="Search by name, email, or username..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all"
                />
              </div>
              
              {/* Search Results Dropdown */}
              {showMemberDropdown && (
                <div className="absolute z-10 w-full max-w-md mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {memberResults.length === 0 ? (
                    <div className="p-4 text-slate-500 text-center">No users found</div>
                  ) : (
                    memberResults
                      .filter(user => !formData.members.find(m => m._id === user._id))
                      .map(user => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => addMember(user)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#950E1D] to-[#B01124] flex items-center justify-center text-white font-medium text-sm">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-slate-500">
                              {user.email} • @{user.username}
                            </div>
                          </div>
                          <UserPlus className="w-4 h-4 text-[#950E1D] ml-auto" />
                        </button>
                      ))
                  )}
                </div>
              )}
            </div>

            {/* Current Members */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                Current Members ({formData.members.length})
              </h3>
              
              {formData.members.length === 0 ? (
                <div className="p-8 bg-slate-50 rounded-xl text-center">
                  <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500">No members added yet</p>
                  <p className="text-sm text-slate-400">Search above to add team members</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.members.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B263B] to-[#2d3d5c] flex items-center justify-center text-white font-medium text-sm">
                          {member.firstName?.[0]}{member.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-slate-500">
                            {member.email}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(member._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/u/my-teams"
              className="px-6 py-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-2.5 bg-[#950E1D] text-white rounded-xl hover:bg-[#7a0c18] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
