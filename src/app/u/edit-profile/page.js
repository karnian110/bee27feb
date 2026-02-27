"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
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
    contact: { email: "", phone: "", officeLocation: "", facebook: "", twitter: "", linkedIn: "" }
  });

  // Fetch profile on load using auth token
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to load profile");
      }
      const data = await res.json();
      setUser(data.user);
      
      setFormData(prev => ({
        ...prev,
        ...data.user,
        expertise: data.user.expertise || [],
        education: data.user.education || [],
        professionalExperience: data.user.professionalExperience || [],
        achievements: data.user.achievements || [],
        researchProfile: { ...prev.researchProfile, ...(data.user.researchProfile || {}) },
        researchOutlook: { ...prev.researchOutlook, ...(data.user.researchOutlook || {}) },
        contact: { ...prev.contact, ...(data.user.contact || {}) }
      }));
      
      setPreviewImage(data.user.profilePicture || null);
    } catch (err) {
      setMessage("Error: " + err.message);
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
      setMessage("Error: Invalid file type. Only JPG, PNG, GIF, WEBP allowed");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Error: File too large. Max size is 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(file);
    
    setUploadingImage(true);
    setMessage("");
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("folder", "profiles");
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }
      
      if (formData.cloudinaryPublicId) {
        await fetch(`/api/upload?publicId=${formData.cloudinaryPublicId}`, {
          method: "DELETE"
        });
      }
      
      setFormData(prev => ({
        ...prev,
        profilePicture: data.url,
        cloudinaryPublicId: data.publicId
      }));
      
      setPreviewImage(data.url);
      setMessage("Image uploaded! Click 'Save Changes' to persist the update.");
    } catch (err) {
      setMessage("Error uploading image: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleNumberChange = (section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: Number(value) || 0 } }));
  };

  const handleArrayStringChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value.split(",").map(s => s.trim()).filter(Boolean) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/u/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessage("Profile saved successfully!");
      fetchProfile();
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Error: New passwords do not match");
      return;
    }
    
    setChangingPassword(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/u/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData)
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setMessage("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const addItem = (field, defaultItem) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], defaultItem] }));
  };

  const updateItem = (field, index, key, value) => {
    setFormData(prev => {
      const items = [...prev[field]];
      items[index][key] = value;
      return { ...prev, [field]: items };
    });
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  const renderBasicTab = () => (
    <div>
      <h3>Basic Information</h3>
      
      {/* Profile Picture Upload */}
      <div style={{ marginBottom: 20, padding: 20, background: "#f5f5f5", borderRadius: 8 }}>
        <h4>Profile Picture</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", width: 120, height: 120, borderRadius: "50%", overflow: "hidden", background: "#ddd" }}>
            {previewImage ? (
              <Image src={previewImage} alt="Profile" fill style={{ objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
                {(formData.firstName?.[0] || "")}{(formData.lastName?.[0] || "")}
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              disabled={uploadingImage}
              style={{ display: "block", marginBottom: 8 }}
            />
            {uploadingImage && <p>Uploading...</p>}
            <p style={{ fontSize: 12, color: "#666" }}>Max size: 5MB. JPG, PNG, GIF, WEBP</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label>First Name</label><input name="firstName" value={formData.firstName} onChange={handleChange} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>Last Name</label><input name="lastName" value={formData.lastName} onChange={handleChange} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>Username *</label><input name="username" value={formData.username} onChange={handleChange} required style={{ width: "100%", padding: 8 }} /></div>
        <div><label>Email (Cannot change)</label><input value={user?.email || ""} disabled style={{ width: "100%", padding: 8, background: "#f5f5f5" }} /></div>
        <div><label>Title</label><input name="title" value={formData.title} onChange={handleChange} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>Institution</label><input name="institution" value={formData.institution} onChange={handleChange} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>Location</label><input name="location" value={formData.location} onChange={handleChange} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>Field of Research</label><input name="fieldOfResearch" value={formData.fieldOfResearch} onChange={handleChange} style={{ width: "100%", padding: 8 }} /></div>
      </div>
      <div style={{ marginTop: 12 }}>
        <label>Bio</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} style={{ width: "100%", padding: 8 }} />
      </div>
      <div style={{ marginTop: 12 }}>
        <label>Expertise (comma-separated)</label>
        <input value={formData.expertise.join(", ")} onChange={e => handleArrayStringChange("expertise", e.target.value)} style={{ width: "100%", padding: 8 }} />
      </div>
    </div>
  );

  const renderResearchTab = () => (
    <div>
      <h3>Research Profile</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        <div><label>Papers</label><input type="number" value={formData.researchProfile.papersPublished} onChange={e => handleNumberChange("researchProfile", "papersPublished", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>Under Review</label><input type="number" value={formData.researchProfile.underReview} onChange={e => handleNumberChange("researchProfile", "underReview", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>Citations</label><input type="number" value={formData.researchProfile.citations} onChange={e => handleNumberChange("researchProfile", "citations", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>h-Index</label><input type="number" value={formData.researchProfile.hIndex} onChange={e => handleNumberChange("researchProfile", "hIndex", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>i10-Index</label><input type="number" value={formData.researchProfile.i10Index} onChange={e => handleNumberChange("researchProfile", "i10Index", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
      </div>
      <h4 style={{ marginTop: 20 }}>Research Outlook</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label>Google Scholar</label><input value={formData.researchOutlook.googleScholarProfile} onChange={e => handleNestedChange("researchOutlook", "googleScholarProfile", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>ResearchGate</label><input value={formData.researchOutlook.researchGateProfile} onChange={e => handleNestedChange("researchOutlook", "researchGateProfile", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>ORCID</label><input value={formData.researchOutlook.orcid} onChange={e => handleNestedChange("researchOutlook", "orcid", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>LinkedIn Profile</label><input value={formData.researchOutlook.linkedInProfile} onChange={e => handleNestedChange("researchOutlook", "linkedInProfile", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div>
      <h3>Contact Information</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label>Contact Email</label><input value={formData.contact.email} onChange={e => handleNestedChange("contact", "email", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>Phone</label><input value={formData.contact.phone} onChange={e => handleNestedChange("contact", "phone", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
        <div style={{ gridColumn: "1 / -1" }}><label>Office Location</label><input value={formData.contact.officeLocation} onChange={e => handleNestedChange("contact", "officeLocation", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>LinkedIn</label><input value={formData.contact.linkedIn} onChange={e => handleNestedChange("contact", "linkedIn", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>Facebook</label><input value={formData.contact.facebook} onChange={e => handleNestedChange("contact", "facebook", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
        <div><label>Twitter</label><input value={formData.contact.twitter} onChange={e => handleNestedChange("contact", "twitter", e.target.value)} style={{ width: "100%", padding: 8 }} /></div>
      </div>
    </div>
  );

  const renderArraySection = (title, field, defaultItem, fields) => (
    <div style={{ marginBottom: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3>{title}</h3>
        <button type="button" onClick={() => addItem(field, defaultItem)} style={{ padding: "6px 12px", background: "#1976d2", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>+ Add</button>
      </div>
      {formData[field].map((item, idx) => (
        <div key={idx} style={{ marginBottom: 16, padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong>#{idx + 1}</strong>
            <button type="button" onClick={() => removeItem(field, idx)} style={{ padding: "2px 8px", background: "#d32f2f", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Remove</button>
          </div>
          {fields.map(f => (
            <div key={f.key} style={{ marginBottom: 8 }}>
              {f.type === "checkbox" ? (
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="checkbox" checked={item[f.key]} onChange={e => updateItem(field, idx, f.key, e.target.checked)} />
                  {f.label}
                </label>
              ) : f.type === "textarea" ? (
                <>
                  <label>{f.label}</label>
                  <textarea value={item[f.key]} onChange={e => updateItem(field, idx, f.key, e.target.value)} style={{ width: "100%", padding: 6 }} />
                </>
              ) : (
                <>
                  <label>{f.label}</label>
                  <input type={f.type || "text"} value={item[f.key]} onChange={e => updateItem(field, idx, f.key, e.target.value)} style={{ width: "100%", padding: 6 }} />
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderEducationTab = () => renderArraySection("Education", "education", 
    { institution: "", degree: "", started: "", completed: "", ongoing: false, result: "", location: "" },
    [
      { key: "institution", label: "Institution" },
      { key: "degree", label: "Degree" },
      { key: "started", label: "Started (YYYY-MM-DD)" },
      { key: "completed", label: "Completed (YYYY-MM-DD)" },
      { key: "ongoing", label: "Ongoing", type: "checkbox" },
      { key: "result", label: "Result" },
      { key: "location", label: "Location" }
    ]
  );

  const renderExperienceTab = () => renderArraySection("Professional Experience", "professionalExperience",
    { jobTitle: "", organization: "", location: "", startDate: "", endDate: "", ongoing: false, briefDescription: "", contributions: "" },
    [
      { key: "jobTitle", label: "Job Title" },
      { key: "organization", label: "Organization" },
      { key: "location", label: "Location" },
      { key: "startDate", label: "Start Date (YYYY-MM-DD)" },
      { key: "endDate", label: "End Date (YYYY-MM-DD)" },
      { key: "ongoing", label: "Ongoing", type: "checkbox" },
      { key: "briefDescription", label: "Description", type: "textarea" },
      { key: "contributions", label: "Contributions", type: "textarea" }
    ]
  );

  const renderAchievementsTab = () => renderArraySection("Achievements", "achievements",
    { name: "", issuingOrganization: "", description: "", links: [] },
    [
      { key: "name", label: "Name" },
      { key: "issuingOrganization", label: "Issuing Organization" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "links", label: "Links (comma-separated)" }
    ]
  );

  const renderPasswordTab = () => (
    <div>
      <h3>Change Password</h3>
      <div>
        <div style={{ marginBottom: 12 }}>
          <label>Current Password</label>
          <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))} required style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>New Password</label>
          <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))} required style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Confirm New Password</label>
          <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))} required style={{ width: "100%", padding: 8 }} />
        </div>
        <button type="button" onClick={handlePasswordChange} disabled={changingPassword} style={{ padding: "10px 20px", background: changingPassword ? "#ccc" : "#388e3c", color: "white", border: "none", borderRadius: 4, cursor: changingPassword ? "not-allowed" : "pointer" }}>
          {changingPassword ? "Changing..." : "Change Password"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30, paddingBottom: 20, borderBottom: "1px solid #ddd" }}>
        <div>
          <h1>Edit Profile</h1>
          <p>Welcome, {user?.fullName || user?.username || "User"} ({user?.role})</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/u/dashboard" style={{ padding: "10px 20px", background: "#1976d2", color: "white", textDecoration: "none", borderRadius: 4 }}>Dashboard</Link>
          {(user?.role === "admin" || user?.role === "moderator") && (
            <>
              {user?.role === "admin" && (
                <Link href="/admin/create-user" style={{ padding: "10px 20px", background: "#ed6c02", color: "white", textDecoration: "none", borderRadius: 4 }}>Manage Users</Link>
              )}
              <Link href="/admin/manage-featured" style={{ padding: "10px 20px", background: "#ed6c02", color: "white", textDecoration: "none", borderRadius: 4 }}>Manage Featured</Link>
            </>
          )}
          <button onClick={handleLogout} style={{ padding: "10px 20px", background: "#d32f2f", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      {message && (
        <div style={{ padding: 12, marginBottom: 20, background: message.includes("Error") ? "#ffebee" : "#e8f5e9", border: `1px solid ${message.includes("Error") ? "#ef5350" : "#66bb6a"}`, borderRadius: 4 }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid #ddd", paddingBottom: 10, flexWrap: "wrap" }}>
        {["basic", "research", "contact", "education", "experience", "achievements", "password"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              background: activeTab === tab ? "#1976d2" : "#f5f5f5",
              color: activeTab === tab ? "white" : "#333",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              textTransform: "capitalize"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 30 }}>
          {activeTab === "basic" && renderBasicTab()}
          {activeTab === "research" && renderResearchTab()}
          {activeTab === "contact" && renderContactTab()}
          {activeTab === "education" && renderEducationTab()}
          {activeTab === "experience" && renderExperienceTab()}
          {activeTab === "achievements" && renderAchievementsTab()}
          {activeTab === "password" && renderPasswordTab()}
        </div>

        {activeTab !== "password" && (
          <button type="submit" disabled={saving} style={{ padding: "14px 40px", background: saving ? "#ccc" : "#1976d2", color: "white", border: "none", borderRadius: 4, fontSize: 16, fontWeight: "bold", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </form>
    </div>
  );
}
