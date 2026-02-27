"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ManageFeatured() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [data, setData] = useState({
    researcher: {
      name: "",
      profilePicture: "",
      cloudinaryPublicId: "",
      title: "",
      institution: "",
      bio: "",
      fieldOfResearch: [],
      expertise: [],
      papersPublished: 0,
      citations: 0,
      hIndex: 0,
      i10Index: 0
    },
    papers: []
  });

  // Fetch data on load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/featured");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      
      // Ensure researcher has all fields
      const researcherData = {
        name: "",
        profilePicture: "",
        cloudinaryPublicId: "",
        title: "",
        institution: "",
        bio: "",
        fieldOfResearch: [],
        expertise: [],
        papersPublished: 0,
        citations: 0,
        hIndex: 0,
        i10Index: 0,
        ...(json.researcher || {})
      };
      
      setData({
        researcher: researcherData,
        papers: json.papers || []
      });
      setPreviewImage(researcherData.profilePicture || null);
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setMessage("Saved successfully!");
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Image upload handler
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

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(file);

    setUploadingImage(true);
    setMessage("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("folder", "featured");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData
      });

      const uploadData = await res.json();

      if (!res.ok) {
        throw new Error(uploadData.error || "Failed to upload image");
      }

      // Delete old image if exists
      if (data.researcher.cloudinaryPublicId) {
        await fetch(`/api/upload?publicId=${data.researcher.cloudinaryPublicId}`, {
          method: "DELETE"
        });
      }

      // Update researcher data with new image
      setData(prev => ({
        ...prev,
        researcher: {
          ...prev.researcher,
          profilePicture: uploadData.url,
          cloudinaryPublicId: uploadData.publicId
        }
      }));

      setPreviewImage(uploadData.url);
      setMessage("Image uploaded successfully! Click 'SAVE ALL CHANGES' to persist.");
    } catch (err) {
      setMessage("Error uploading image: " + err.message);
      // Reset preview on error
      setPreviewImage(data.researcher.profilePicture || null);
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove image handler
  const handleRemoveImage = async () => {
    if (!data.researcher.cloudinaryPublicId && !data.researcher.profilePicture) {
      return;
    }

    try {
      // Delete from Cloudinary if public ID exists
      if (data.researcher.cloudinaryPublicId) {
        await fetch(`/api/upload?publicId=${data.researcher.cloudinaryPublicId}`, {
          method: "DELETE"
        });
      }

      // Clear image data
      setData(prev => ({
        ...prev,
        researcher: {
          ...prev.researcher,
          profilePicture: "",
          cloudinaryPublicId: ""
        }
      }));
      setPreviewImage(null);
      setMessage("Image removed. Click 'SAVE ALL CHANGES' to persist.");
    } catch (err) {
      setMessage("Error removing image: " + err.message);
    }
  };

  // Researcher field handlers
  const updateResearcher = (field, value) => {
    setData(prev => ({
      ...prev,
      researcher: { ...prev.researcher, [field]: value }
    }));
  };

  const updateResearcherNumber = (field, value) => {
    setData(prev => ({
      ...prev,
      researcher: { ...prev.researcher, [field]: Number(value) || 0 }
    }));
  };

  // Array field handlers (comma-separated)
  const updateArrayField = (field, value) => {
    setData(prev => ({
      ...prev,
      researcher: { ...prev.researcher, [field]: value.split(",").map(s => s.trim()).filter(Boolean) }
    }));
  };

  // Paper handlers
  const addPaper = () => {
    setData(prev => ({
      ...prev,
      papers: [...prev.papers, {
        title: "",
        authors: [],
        journalName: "",
        year: new Date().getFullYear(),
        highlights: "",
        doi: "",
        fullPaperLink: "",
        citations: 0
      }]
    }));
  };

  const updatePaper = (index, field, value) => {
    setData(prev => {
      const papers = [...prev.papers];
      if (field === "authors") {
        papers[index][field] = value.split(",").map(s => s.trim()).filter(Boolean);
      } else if (field === "year" || field === "citations") {
        papers[index][field] = Number(value) || 0;
      } else {
        papers[index][field] = value;
      }
      return { ...prev, papers };
    });
  };

  const removePaper = (index) => {
    setData(prev => ({
      ...prev,
      papers: prev.papers.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  const r = data.researcher;

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Manage Featured Research</h1>
      
      {message && (
        <div style={{ 
          padding: "10px 20px", 
          marginBottom: 20, 
          background: message.includes("Error") ? "#ffebee" : "#e8f5e9",
          border: `1px solid ${message.includes("Error") ? "#ef5350" : "#66bb6a"}`,
          borderRadius: 4
        }}>
          {message}
        </div>
      )}

      {/* Researcher Section */}
      <section style={{ marginBottom: 40, padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Featured Researcher</h2>
        
        {/* Profile Picture Upload Section */}
        <div style={{ 
          marginBottom: 30, 
          padding: 20, 
          background: "#f5f5f5", 
          borderRadius: 8,
          border: "1px solid #e0e0e0"
        }}>
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Profile Picture</h3>
          
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
            {/* Image Preview */}
            <div style={{ 
              width: 150, 
              height: 150, 
              borderRadius: 8, 
              overflow: "hidden",
              background: "#ddd",
              border: "2px solid #ccc",
              flexShrink: 0,
              position: "relative"
            }}>
              {previewImage ? (
                <Image 
                  src={previewImage} 
                  alt="Researcher Profile" 
                  fill
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div style={{ 
                  width: "100%", 
                  height: "100%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#666",
                  fontSize: 14
                }}>
                  No Image
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ marginBottom: 12 }}>
                <label 
                  style={{ 
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    background: uploadingImage ? "#9e9e9e" : "#1976d2",
                    color: "white",
                    borderRadius: 4,
                    cursor: uploadingImage ? "not-allowed" : "pointer",
                    fontSize: 14,
                    fontWeight: 500
                  }}
                >
                  {uploadingImage ? (
                    <>
                      <span style={{ 
                        display: "inline-block",
                        width: 16,
                        height: 16,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                      Uploading...
                    </>
                  ) : (
                    <>
                      📷 Upload Image
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              {previewImage && (
                <button
                  onClick={handleRemoveImage}
                  disabled={uploadingImage}
                  style={{
                    padding: "8px 16px",
                    background: "#d32f2f",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: uploadingImage ? "not-allowed" : "pointer",
                    fontSize: 14
                  }}
                >
                  🗑️ Remove Image
                </button>
              )}

              <p style={{ 
                margin: "12px 0 0 0", 
                fontSize: 13, 
                color: "#666",
                lineHeight: 1.5
              }}>
                Max size: 5MB<br />
                Supported formats: JPG, PNG, GIF, WEBP<br />
                Recommended: Square image (1:1 ratio)
              </p>
            </div>
          </div>

          {/* Hidden fields for URL and publicId */}
          <input 
            type="hidden" 
            value={r.profilePicture || ""} 
          />
          <input 
            type="hidden" 
            value={r.cloudinaryPublicId || ""} 
          />
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          <div>
            <label>Name *</label>
            <input 
              type="text" 
              value={r.name} 
              onChange={e => updateResearcher("name", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          
          <div>
            <label>Title</label>
            <input 
              type="text" 
              value={r.title} 
              onChange={e => updateResearcher("title", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          
          <div>
            <label>Institution</label>
            <input 
              type="text" 
              value={r.institution} 
              onChange={e => updateResearcher("institution", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          
          {/* Manual URL input as fallback */}
          <div>
            <label>Profile Picture URL (Manual)</label>
            <input 
              type="text" 
              value={r.profilePicture} 
              onChange={e => {
                updateResearcher("profilePicture", e.target.value);
                setPreviewImage(e.target.value);
              }}
              placeholder="Or paste image URL directly"
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Bio</label>
            <textarea 
              value={r.bio} 
              onChange={e => updateResearcher("bio", e.target.value)}
              rows={4}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          
          <div>
            <label>Fields of Research (comma-separated)</label>
            <input 
              type="text" 
              value={r.fieldOfResearch.join(", ")} 
              onChange={e => updateArrayField("fieldOfResearch", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          
          <div>
            <label>Expertise (comma-separated)</label>
            <input 
              type="text" 
              value={r.expertise.join(", ")} 
              onChange={e => updateArrayField("expertise", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
        </div>

        <h3 style={{ marginTop: 20 }}>Metrics</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <div>
            <label>Papers Published</label>
            <input 
              type="number" 
              value={r.papersPublished} 
              onChange={e => updateResearcherNumber("papersPublished", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          <div>
            <label>Citations</label>
            <input 
              type="number" 
              value={r.citations} 
              onChange={e => updateResearcherNumber("citations", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          <div>
            <label>h-index</label>
            <input 
              type="number" 
              value={r.hIndex} 
              onChange={e => updateResearcherNumber("hIndex", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          <div>
            <label>i10-index</label>
            <input 
              type="number" 
              value={r.i10Index} 
              onChange={e => updateResearcherNumber("i10Index", e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
        </div>
      </section>

      {/* Papers Section */}
      <section style={{ marginBottom: 40, padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2>Featured Papers ({data.papers.length})</h2>
          <button 
            onClick={addPaper}
            style={{ padding: "8px 16px", background: "#1976d2", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
          >
            + Add Paper
          </button>
        </div>

        {data.papers.length === 0 && <p>No papers added yet.</p>}

        {data.papers.map((paper, idx) => (
          <div key={idx} style={{ marginBottom: 20, padding: 16, background: "#f5f5f5", borderRadius: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <h4>Paper #{idx + 1}</h4>
              <button 
                onClick={() => removePaper(idx)}
                style={{ padding: "4px 12px", background: "#d32f2f", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
              >
                Remove
              </button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Title *</label>
                <input 
                  type="text" 
                  value={paper.title} 
                  onChange={e => updatePaper(idx, "title", e.target.value)}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </div>
              
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Authors (comma-separated) *</label>
                <input 
                  type="text" 
                  value={paper.authors.join(", ")} 
                  onChange={e => updatePaper(idx, "authors", e.target.value)}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </div>
              
              <div>
                <label>Journal Name *</label>
                <input 
                  type="text" 
                  value={paper.journalName} 
                  onChange={e => updatePaper(idx, "journalName", e.target.value)}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </div>
              
              <div>
                <label>Year *</label>
                <input 
                  type="number" 
                  value={paper.year} 
                  onChange={e => updatePaper(idx, "year", e.target.value)}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </div>
              
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Highlights</label>
                <textarea 
                  value={paper.highlights} 
                  onChange={e => updatePaper(idx, "highlights", e.target.value)}
                  rows={2}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </div>
              
              <div>
                <label>DOI</label>
                <input 
                  type="text" 
                  value={paper.doi} 
                  onChange={e => updatePaper(idx, "doi", e.target.value)}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </div>
              
              <div>
                <label>Citations</label>
                <input 
                  type="number" 
                  value={paper.citations} 
                  onChange={e => updatePaper(idx, "citations", e.target.value)}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </div>
              
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Full Paper Link</label>
                <input 
                  type="text" 
                  value={paper.fullPaperLink} 
                  onChange={e => updatePaper(idx, "fullPaperLink", e.target.value)}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Save Button */}
      <div style={{ position: "sticky", bottom: 20, background: "white", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
        <button 
          onClick={saveData}
          disabled={saving || uploadingImage}
          style={{ 
            width: "100%", 
            padding: "16px", 
            background: saving || uploadingImage ? "#9e9e9e" : "#2e7d32", 
            color: "white", 
            border: "none", 
            borderRadius: 4, 
            cursor: saving || uploadingImage ? "not-allowed" : "pointer",
            fontSize: 16,
            fontWeight: "bold"
          }}
        >
          {saving ? "Saving..." : "SAVE ALL CHANGES"}
        </button>
      </div>

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
