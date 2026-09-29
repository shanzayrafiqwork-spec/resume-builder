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

  const handlePrint = () => {
    window.print();
  };

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
    <div className="resume-card" id="printable-resume">
      <div
        className="no-print"
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
          fontSize: "18px",
          color: "#0f172a",
          marginBottom: "16px",
          borderBottom: "2px solid #e2e8f0",
          paddingBottom: "8px",
        }}
      >
        Candidate Profile Details
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: imageSrc ? "1fr 140px" : "1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: "10px", fontSize: "14px", color: "#334155" }}>
          <div><strong>Full Name:</strong> {data.name || data.fullName}</div>
          <div><strong>Email:</strong> {data.email}</div>
          <div><strong>Phone:</strong> {data.phone || "N/A"}</div>
          <div><strong>Skills:</strong> {data.skills || "N/A"}</div>
          <div><strong>Experience:</strong> {data.experience || "N/A"}</div>
          {data.fileName && <div><strong>Attached File Name:</strong> {data.fileName}</div>}
        </div>

        {/* Profile Picture Display */}
        {imageSrc && (
          <div
            style={{
              textAlign: "center",
            }}
          >
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
        )}
      </div>

      {/* Action Buttons */}
      <div
        className="no-print"
        style={{ marginTop: "28px", display: "flex", gap: "12px", justifyContent: "center" }}
      >
        <button
          onClick={handlePrint}
          className="btn-submit"
          style={{ width: "auto", padding: "12px 24px", backgroundColor: "#059669" }}
        >
          📄 Download as PDF
        </button>
        <Link
          href="/"
          className="btn-submit"
          style={{ textDecoration: "none", textAlign: "center", width: "auto", padding: "12px 24px" }}
        >
          Submit Another Resume
        </Link>
      </div>

      {/* Print Stylesheet for clean PDF output */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .resume-card {
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}