"use client";

import "./globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
  });
  const [file, setFile] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  // File change event + instant Base64 conversion
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result); // Base64 data string store kar rahe hain
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setBase64Image(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("skills", formData.skills);
    data.append("experience", formData.experience);
    if (file) {
      data.append("file", file);
    }

    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        // Guaranteed picture availability for success page
        const submissionData = {
          ...result.data,
          displayImage: base64Image || result.data?.imageUrl,
        };
        localStorage.setItem("submittedResume", JSON.stringify(submissionData));
        router.push("/success");
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-card">
      <h1 className="card-title">Resume Builder</h1>
      <p className="card-subtitle">Fill in your professional details to create your CV</p>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="+1 234 567 890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Skills</label>
            <input
              type="text"
              className="form-input"
              placeholder="React, Node.js, MongoDB"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Work Experience</label>
            <textarea
              rows="3"
              className="form-input"
              placeholder="Brief description of experience..."
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            ></textarea>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Upload Profile Picture / CV File</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                className="file-upload-input"
                onChange={handleFileChange}
              />
              <span className="upload-icon">📁</span>
              <div className="upload-text">
                {file ? "Change Selected File" : "Click or Drag File Here"}
              </div>
              <p className="upload-hint">Accepted formats: JPG, PNG, WEBP, PDF</p>
              {file && (
                <div className="selected-file-badge">
                  Selected: {file.name}
                </div>
              )}
            </div>

            {/* Live Client Preview */}
            {base64Image && (
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <p style={{ fontSize: "12px", color: "#6d28d9", marginBottom: "8px", fontWeight: "600" }}>
                  Image Preview:
                </p>
                <div style={{ width: "100px", height: "100px", margin: "0 auto", overflow: "hidden", borderRadius: "12px", border: "2px solid #7c3aed" }}>
                  <img
                    src={base64Image}
                    alt="Uploaded Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Submitting..." : "Submit Resume"}
        </button>
      </form>
    </div>
  );
}