"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  GraduationCap,
  Award,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  X,
  Plus,
  Trash2,
  Save,
  LogOut,
  Upload,
  Loader2,
  Users,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("basic");

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Image upload
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    fieldOfResearch: "",
    institution: "",
    title: "",
    location: "",
    profilePicture: "",
    cloudinaryPublicId: "",
    expertise: [],
    education: [],
    professionalExperience: [],
    achievements: [],
    researchProfile: { papersPublished: 0, underReview: 0, citations: 0, hIndex: 0, i10Index: 0 },
    researchOutlook: { googleScholarProfile: "", researchGateProfile: "", orcid: "", linkedInProfile: "" },
    contact: { email: "", phone: "", officeLocation: "", facebook: "", twitter: "", linkedIn: "" },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setUser(data.user);

      setFormData((prev) => ({
        ...prev,
        ...data.user,
        expertise: data.user.expertise || [],
        education: data.user.education || [],
        professionalExperience: data.user.professionalExperience || [],
        achievements: data.user.achievements || [],
        researchProfile: { ...prev.researchProfile, ...(data.user.researchProfile || {}) },
        researchOutlook: { ...prev.researchOutlook, ...(data.user.researchOutlook || {}) },
        contact: { ...prev.contact, ...(data.user.contact || {}) },
      }));

      setPreviewImage(data.user.profilePicture || null);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Invalid file type. Only JPG, PNG, GIF, WEBP allowed" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File too large. Max size is 5MB" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(file);

    setUploadingImage(true);
    setMessage({ type: "", text: "" });

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("folder", "profiles");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      if (formData.cloudinaryPublicId) {
        await fetch(`/api/upload?publicId=${formData.cloudinaryPublicId}`, {
          method: "DELETE",
        });
      }

      setFormData((prev) => ({
        ...prev,
        profilePicture: data.url,
        cloudinaryPublicId: data.publicId,
      }));

      setPreviewImage(data.url);
      setMessage({ type: "success", text: "Image uploaded successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Error uploading image: " + err.message });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleNumberChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: Number(value) || 0 },
    }));
  };

  const handleArrayStringChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(",").map((s) => s.trim()).filter(Boolean),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/u/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessage({ type: "success", text: "Profile saved successfully!" });
      fetchProfile();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setChangingPassword(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/u/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setChangingPassword(false);
    }
  };

  const addItem = (field, defaultItem) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], defaultItem] }));
  };

  const updateItem = (field, index, key, value) => {
    setFormData((prev) => {
      const items = [...prev[field]];
      items[index][key] = value;
      return { ...prev, [field]: items };
    });
  };

  const removeItem = (field, index) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-56 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "basic", label: "Basic", icon: User },
    { id: "research", label: "Research", icon: GraduationCap },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "password", label: "Password", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">
                Welcome back, {user?.fullName || user?.username} ({user?.role})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/u/my-teams"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Users className="h-4 w-4 mr-2" />
              My Teams
            </Link>
            {(user?.role === "admin" || user?.role === "moderator") && (
              <div className="relative group">
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Admin Panel
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {user?.role === "admin" && (
                    <Link
                      href="/admin/create-user"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Manage Users
                    </Link>
                  )}
                  <Link
                    href="/admin/manage-featured"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Manage Featured
                  </Link>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {message.text && (
          <div
            className={`mb-6 rounded-md p-4 ${
              message.type === "error"
                ? "bg-red-50 border border-red-200 text-red-800"
                : message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-blue-50 border border-blue-200 text-blue-800"
            }`}
          >
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon
                    className={`
                      -ml-0.5 mr-2 h-5 w-5
                      ${
                        activeTab === tab.id
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }
                    `}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {activeTab === "basic" && (
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>

              {/* Profile Picture */}
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-2xl font-medium text-gray-500">
                        {formData.firstName?.[0] || ""}
                        {formData.lastName?.[0] || ""}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload new image
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        disabled={uploadingImage}
                      />
                    </label>
                    {uploadingImage && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Max size: 5MB. JPG, PNG, GIF, WEBP
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                    Institution
                  </label>
                  <input
                    type="text"
                    name="institution"
                    id="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="fieldOfResearch" className="block text-sm font-medium text-gray-700">
                    Field of Research
                  </label>
                  <input
                    type="text"
                    name="fieldOfResearch"
                    id="fieldOfResearch"
                    value={formData.fieldOfResearch}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
                  Expertise (comma-separated)
                </label>
                <input
                  type="text"
                  id="expertise"
                  value={formData.expertise.join(", ")}
                  onChange={(e) => handleArrayStringChange("expertise", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          )}

          {activeTab === "research" && (
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Research Profile</h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
                {[
                  { label: "Papers Published", key: "papersPublished" },
                  { label: "Under Review", key: "underReview" },
                  { label: "Citations", key: "citations" },
                  { label: "h-Index", key: "hIndex" },
                  { label: "i10-Index", key: "i10Index" },
                ].map((field) => (
                  <div key={field.key}>
                    <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type="number"
                      id={field.key}
                      value={formData.researchProfile[field.key]}
                      onChange={(e) => handleNumberChange("researchProfile", field.key, e.target.value)}
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>

              <h3 className="text-md font-medium text-gray-900 pt-4">Research Outlook</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {[
                  { label: "Google Scholar", key: "googleScholarProfile", icon: Globe },
                  { label: "ResearchGate", key: "researchGateProfile", icon: Globe },
                  { label: "ORCID", key: "orcid", icon: Globe },
                  { label: "LinkedIn Profile", key: "linkedInProfile", icon: Linkedin },
                ].map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key}>
                      <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id={field.key}
                          value={formData.researchOutlook[field.key]}
                          onChange={(e) => handleNestedChange("researchOutlook", field.key, e.target.value)}
                          className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={formData.contact.email}
                    onChange={(e) => handleNestedChange("contact", "email", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.contact.phone}
                    onChange={(e) => handleNestedChange("contact", "phone", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="officeLocation" className="block text-sm font-medium text-gray-700">
                    Office Location
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="officeLocation"
                      value={formData.contact.officeLocation}
                      onChange={(e) => handleNestedChange("contact", "officeLocation", e.target.value)}
                      className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                {[
                  { label: "LinkedIn", key: "linkedIn", icon: Linkedin },
                  { label: "Facebook", key: "facebook", icon: Facebook },
                  { label: "Twitter", key: "twitter", icon: Twitter },
                ].map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key}>
                      <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id={field.key}
                          value={formData.contact[field.key]}
                          onChange={(e) => handleNestedChange("contact", field.key, e.target.value)}
                          className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education, Experience, Achievements tabs */}
          {activeTab === "education" && (
            <ArraySection
              title="Education"
              field="education"
              defaultItem={{
                institution: "",
                degree: "",
                started: "",
                completed: "",
                ongoing: false,
                result: "",
                location: "",
              }}
              fields={[
                { key: "institution", label: "Institution", type: "text" },
                { key: "degree", label: "Degree", type: "text" },
                { key: "started", label: "Started (YYYY-MM-DD)", type: "text" },
                { key: "completed", label: "Completed (YYYY-MM-DD)", type: "text" },
                { key: "ongoing", label: "Ongoing", type: "checkbox" },
                { key: "result", label: "Result", type: "text" },
                { key: "location", label: "Location", type: "text" },
              ]}
              formData={formData}
              setFormData={setFormData}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
            />
          )}

          {activeTab === "experience" && (
            <ArraySection
              title="Professional Experience"
              field="professionalExperience"
              defaultItem={{
                jobTitle: "",
                organization: "",
                location: "",
                startDate: "",
                endDate: "",
                ongoing: false,
                briefDescription: "",
                contributions: "",
              }}
              fields={[
                { key: "jobTitle", label: "Job Title", type: "text" },
                { key: "organization", label: "Organization", type: "text" },
                { key: "location", label: "Location", type: "text" },
                { key: "startDate", label: "Start Date (YYYY-MM-DD)", type: "text" },
                { key: "endDate", label: "End Date (YYYY-MM-DD)", type: "text" },
                { key: "ongoing", label: "Ongoing", type: "checkbox" },
                { key: "briefDescription", label: "Description", type: "textarea" },
                { key: "contributions", label: "Contributions", type: "textarea" },
              ]}
              formData={formData}
              setFormData={setFormData}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
            />
          )}

          {activeTab === "achievements" && (
            <ArraySection
              title="Achievements"
              field="achievements"
              defaultItem={{
                name: "",
                issuingOrganization: "",
                description: "",
                links: [],
              }}
              fields={[
                { key: "name", label: "Name", type: "text" },
                { key: "issuingOrganization", label: "Issuing Organization", type: "text" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "links", label: "Links (comma-separated)", type: "text" },
              ]}
              formData={formData}
              setFormData={setFormData}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
            />
          )}

          {activeTab === "password" && (
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handlePasswordChange}
                    disabled={changingPassword}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button (except password tab) */}
          {activeTab !== "password" && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

// Reusable component for array sections (Education, Experience, Achievements)
function ArraySection({ title, field, defaultItem, fields, formData, setFormData, addItem, updateItem, removeItem }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <button
          type="button"
          onClick={() => addItem(field, defaultItem)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </button>
      </div>

      {formData[field].length === 0 ? (
        <p className="text-gray-500 text-sm">No items added yet.</p>
      ) : (
        <div className="space-y-4">
          {formData[field].map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-gray-700">Item #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(field, index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                {fields.map((f) => (
                  <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                    {f.type === "checkbox" ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${field}-${index}-${f.key}`}
                          checked={item[f.key] || false}
                          onChange={(e) => updateItem(field, index, f.key, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`${field}-${index}-${f.key}`} className="ml-2 block text-sm text-gray-700">
                          {f.label}
                        </label>
                      </div>
                    ) : f.type === "textarea" ? (
                      <div>
                        <label htmlFor={`${field}-${index}-${f.key}`} className="block text-sm font-medium text-gray-700">
                          {f.label}
                        </label>
                        <textarea
                          id={`${field}-${index}-${f.key}`}
                          value={item[f.key] || ""}
                          onChange={(e) => updateItem(field, index, f.key, e.target.value)}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    ) : (
                      <div>
                        <label htmlFor={`${field}-${index}-${f.key}`} className="block text-sm font-medium text-gray-700">
                          {f.label}
                        </label>
                        <input
                          type={f.type || "text"}
                          id={`${field}-${index}-${f.key}`}
                          value={item[f.key] || ""}
                          onChange={(e) => updateItem(field, index, f.key, e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}