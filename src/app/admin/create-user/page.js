"use client";

import { useState, useEffect } from "react";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    role: "user"
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState("");

  // Fetch users on load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }
      
      setResult(data);
      // Console log the password as requested
      console.log("=== NEW USER CREATED ===");
      console.log("Email:", data.user.email);
      console.log("Username:", data.user.username);
      console.log("Generated Password:", data.generatedPassword);
      console.log("========================");
      
      // Refresh user list
      await fetchUsers();
      
      // Reset form
      setFormData({
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        role: "user"
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
      return;
    }
    
    setDeleteLoading(userId);
    
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE"
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user");
      }
      
      // Refresh user list
      await fetchUsers();
      console.log("User deleted:", data.user);
    } catch (err) {
      alert("Error deleting user: " + err.message);
    } finally {
      setDeleteLoading("");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={{ padding: 40, maxWidth: 1000, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>User Management</h1>
      
      {error && (
        <div style={{ 
          padding: "12px 16px", 
          marginBottom: 20, 
          background: "#ffebee",
          border: "1px solid #ef5350",
          borderRadius: 4,
          color: "#c62828"
        }}>
          {error}
        </div>
      )}
      
      {result && (
        <div style={{ 
          padding: "16px", 
          marginBottom: 20, 
          background: "#e8f5e9",
          border: "1px solid #66bb6a",
          borderRadius: 4
        }}>
          <p style={{ margin: "0 0 12px 0", fontWeight: "bold", color: "#2e7d32" }}>
            ✓ User created successfully!
          </p>
          <div style={{ 
            padding: 12, 
            background: "#fff3e0", 
            border: "1px solid #ff9800",
            borderRadius: 4,
            marginBottom: 12
          }}>
            <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
              Generated Password (copy this):
            </p>
            <code style={{ 
              display: "block",
              padding: 8,
              background: "#263238",
              color: "#69f0ae",
              fontSize: 16,
              borderRadius: 4,
              fontFamily: "monospace"
            }}>
              {result.generatedPassword}
            </code>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
            User: {result.user.email} ({result.user.username})
          </p>
        </div>
      )}

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        
        {/* Left: Create User Form */}
        <div>
          <h2>Create New User</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: 16,
                  border: "1px solid #ccc",
                  borderRadius: 4
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: 16,
                  border: "1px solid #ccc",
                  borderRadius: 4
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: 16,
                    border: "1px solid #ccc",
                    borderRadius: 4
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: 16,
                    border: "1px solid #ccc",
                    borderRadius: 4
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: 16,
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  background: "white"
                }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#9e9e9e" : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: 4,
                fontSize: 16,
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: 16, background: "#f5f5f5", borderRadius: 4, fontSize: 14 }}>
            <p style={{ margin: "0 0 8px 0", fontWeight: 500 }}>Password is auto-generated:</p>
            <ul style={{ margin: 0, paddingLeft: 20, color: "#666" }}>
              <li>12 character random string</li>
              <li>Hashed with bcrypt before storing</li>
              <li>Displayed only once after creation</li>
              <li>Also logged to browser console</li>
            </ul>
          </div>
        </div>

        {/* Right: Users List */}
        <div>
          <h2>Existing Users ({users.length})</h2>
          
          {fetching ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div style={{ maxHeight: 600, overflowY: "auto", border: "1px solid #ddd", borderRadius: 4 }}>
              {users.map((user) => (
                <div 
                  key={user._id}
                  style={{ 
                    padding: 16, 
                    borderBottom: "1px solid #eee",
                    background: user.role === "admin" ? "#fff8e1" : "white"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>
                        {user.firstName} {user.lastName}
                        {user.firstName || user.lastName ? " " : ""}
                        <span style={{ 
                          display: "inline-block",
                          padding: "2px 8px",
                          background: user.role === "admin" ? "#ed6c02" : "#e0e0e0",
                          color: user.role === "admin" ? "white" : "#333",
                          borderRadius: 12,
                          fontSize: 12,
                          textTransform: "uppercase"
                        }}>
                          {user.role}
                        </span>
                      </p>
                      <p style={{ margin: "0 0 4px 0", fontSize: 14, color: "#666" }}>
                        {user.email}
                      </p>
                      <p style={{ margin: 0, fontSize: 13, color: "#999" }}>
                        @{user.username} • Created: {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(user._id, user.email)}
                      disabled={deleteLoading === user._id}
                      style={{
                        padding: "6px 12px",
                        background: deleteLoading === user._id ? "#ccc" : "#d32f2f",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        fontSize: 13,
                        cursor: deleteLoading === user._id ? "not-allowed" : "pointer"
                      }}
                    >
                      {deleteLoading === user._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
