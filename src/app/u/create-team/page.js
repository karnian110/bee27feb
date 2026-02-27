"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Users,
  Plus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Upload,
  Search,
  Trash2,
  UserPlus,
  Check,
  Sparkles,
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

export default function CreateTeam() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    teamName: "",
    moto: "",
    email: "",
    about: "",
    fieldOfResearch: "",
    profilePicture: "",
    cloudinaryPublicId: "",
    expertise: "",
  });
  
  // Member selection
  const [memberSearch, setMemberSearch] = useState("");
  const [memberResults, setMemberResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const memberInputRef = useRef(null);
  
  const debouncedMemberSearch = useDebounce(memberSearch, 300);
  
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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
    if (!selectedMembers.find(m => m._id === user._id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setMemberSearch("");
    setShowMemberDropdown(false);
  };

  const removeMember = (userId) => {
    setSelectedMembers(selectedMembers.filter(m => m._id !== userId));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        teamName: formData.teamName,
        members: selectedMembers.map(m => m._id),
        email: formData.email,
        about: formData.about,
        fieldOfResearch: formData.fieldOfResearch,
        profilePicture: formData.profilePicture,
        cloudinaryPublicId: formData.cloudinaryPublicId,
        moto: formData.moto,
        expertise: formData.expertise.split(",").map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch("/api/u/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create team");
      }

      setResult(data);
      
      // Redirect to my-teams page after 1.5 seconds
      setTimeout(() => {
        router.push("/u/my-teams");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/u/my-teams"
            className="inline-flex items-center text-sm text-slate-500 hover:text-[#950E1D] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to My Teams
          </Link>
          <h1 className="text-3xl font-bold text-[#1B263B]">Create New Team</h1>
          <p className="text-slate-500 mt-1">
            Create a research team and invite members to collaborate
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
            <Check className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Team &ldquo;{result.team.teamName}&rdquo; created successfully!</p>
              <p className="text-sm">Redirecting to your teams...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Image & Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-[#1B263B] mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#950E1D]" />
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
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                      {getInitials(formData.teamName) || "TE"}
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
                  placeholder="Enter your team name"
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
                  placeholder="team@example.com"
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
                  placeholder="e.g., Computer Science"
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
                  placeholder="Describe your team, its goals, and research focus..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#950E1D]/20 focus:border-[#950E1D] outline-none transition-all resize-none"
                />
              </div>
            </div>
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
                      .filter(user => !selectedMembers.find(m => m._id === user._id))
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

            {/* Selected Members */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">
                Selected Members ({selectedMembers.length})
              </h3>
              
              {selectedMembers.length === 0 ? (
                <div className="p-8 bg-slate-50 rounded-xl text-center">
                  <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500">No members added yet</p>
                  <p className="text-sm text-slate-400">Search above to add team members</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedMembers.map((member) => (
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
              disabled={loading}
              className="inline-flex items-center px-6 py-2.5 bg-[#950E1D] text-white rounded-xl hover:bg-[#7a0c18] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
