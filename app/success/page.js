"use client";

import "../globals.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("submittedResume");
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  if (!data) {
    return (
      <div className="resume-card" style={{ textAlign: "center" }}>
        <p style={{ color: "#64748b", marginBottom: "16px" }}>No submission record found.</p>
        <Link href="/" className="btn-submit" style={{ textDecoration: "none" }}>
          Back to Form
        </Link>
      </div>
    );
  }

  const imageSrc = data.displayImage || data.imageUrl;

  return (
    <div className="resume-card">
      <div
        style={{
          backgroundColor: "#ede9fe",
          border: "1px solid #ddd6fe",
          borderRadius: "12px",
          padding: "16px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "#5b21b6", fontSize: "20px", margin: "0 0 4px 0" }}>
          🎉 Resume Submitted Successfully!
        </h2>
        <p style={{ color: "#6d28d9", fontSize: "13px", margin: 0 }}>
          Candidate profile details are saved.
        </p>
      </div>

      <h3
        style={{
          fontSize: "16px",
          color: "#0f172a",
          marginBottom: "12px",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "6px",
        }}
      >
        Candidate Details
      </h3>

      <div style={{ display: "grid", gap: "10px", fontSize: "14px", color: "#334155" }}>
        <div><strong>Full Name:</strong> {data.name || data.fullName}</div>
        <div><strong>Email:</strong> {data.email}</div>
        <div><strong>Phone:</strong> {data.phone || "N/A"}</div>
        <div><strong>Skills:</strong> {data.skills || "N/A"}</div>
        <div><strong>Experience:</strong> {data.experience || "N/A"}</div>
      </div>

      {/* Profile Picture Box */}
      {imageSrc ? (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            textAlign: "center",
          }}
        >
          <p style={{ fontWeight: "600", fontSize: "14px", color: "#334155", marginBottom: "10px" }}>
            Uploaded Candidate Picture:
          </p>
          <div
            style={{
              width: "130px",
              height: "130px",
              margin: "0 auto",
              borderRadius: "12px",
              overflow: "hidden",
              border: "3px solid #7c3aed",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)",
            }}
          >
            <img
              src={imageSrc}
              alt="Candidate Photo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#f1f5f9",
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          No image file uploaded.
        </div>
      )}

      <div style={{ marginTop: "24px" }}>
        <Link href="/" className="btn-submit" style={{ textDecoration: "none", textAlign: "center" }}>
          Submit Another Resume
        </Link>
      </div>
    </div>
  );
}