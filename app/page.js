"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    education: "",
    fileData: "", // Holds Base64 string for image/document
    fileName: "",
  });

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch all resumes
  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/resumes");
      const data = await res.json();
      if (data.success) {
        setResumes(data.data);
      }
    } catch (err) {
      console.error("Error fetching resumes:", err);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Handle Text Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File / Image Upload and convert to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size must be under 4MB." });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          fileData: reader.result,
          fileName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          skills: formData.skills,
          experience: formData.experience,
          education: formData.education,
          filePath: formData.fileData, // Saving image/file Base64
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "Resume saved successfully!" });
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          skills: "",
          experience: "",
          education: "",
          fileData: "",
          fileName: "",
        });
        fetchResumes();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to connect to server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Top Header */}
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Professional <span className="text-blue-500">Resume Builder</span>
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Create, upload, and manage your professional resumes in real-time.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Panel */}
        <div className="lg:col-span-6 bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700/60 shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            📝 Enter Details
          </h2>
          
          {message.text && (
            <div
              className={`p-4 mb-6 rounded-lg text-sm font-medium ${
                message.type === "error"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="React, Next.js, Node.js"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Work Experience
              </label>
              <textarea
                name="experience"
                rows="3"
                value={formData.experience}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                placeholder="Senior Web Developer at Tech Inc..."
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Education
              </label>
              <textarea
                name="education"
                rows="2"
                value={formData.education}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                placeholder="BS Computer Science..."
              ></textarea>
            </div>

            {/* File Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Upload Picture or Resume File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-lg hover:border-blue-500 transition bg-slate-900/50">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-10 w-10 text-slate-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20L28 8z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-slate-400">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, PDF up to 4MB</p>
                  {formData.fileName && (
                    <p className="text-xs text-emerald-400 font-semibold mt-2">
                      Selected: {formData.fileName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/20 transition duration-200 disabled:opacity-50"
            >
              {loading ? "Saving Resume..." : "Save Resume"}
            </button>
          </form>
        </div>

        {/* Right Cards List */}
        <div className="lg:col-span-6 bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center justify-between">
            <span>📋 Saved Resumes</span>
            <span className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full">
              Total: {resumes.length}
            </span>
          </h2>

          {resumes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-700 rounded-xl">
              <p className="text-slate-400 text-sm">No resumes saved yet.</p>
              <p className="text-slate-500 text-xs mt-1">
                Fill out the form on the left to add your first resume.
              </p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[680px] pr-2 custom-scrollbar">
              {resumes.map((res) => (
                <div
                  key={res._id}
                  className="bg-slate-900 border border-slate-700/70 p-5 rounded-xl hover:border-blue-500/50 transition shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {res.fullName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ✉ {res.email} {res.phone && `• 📞 ${res.phone}`}
                      </p>
                    </div>

                    {/* Show File/Image Preview or Link if exists */}
                    {res.filePath && (
                      <div>
                        {res.filePath.startsWith("data:image") ? (
                          <img
                            src={res.filePath}
                            alt="Uploaded"
                            className="w-12 h-12 object-cover rounded-lg border border-slate-600"
                          />
                        ) : (
                          <a
                            href={res.filePath}
                            download={`${res.fullName}_Resume`}
                            className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-1.5 rounded-lg hover:bg-blue-600/30 transition"
                          >
                            📄 View File
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {res.skills && res.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {res.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-slate-800 text-blue-400 border border-slate-700 text-xs font-medium px-2 py-0.5 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {res.experience && (
                    <div className="text-xs text-slate-300 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/40">
                      <strong className="text-slate-400 block mb-0.5">
                        Experience:
                      </strong>
                      {res.experience}
                    </div>
                  )}

                  {res.education && (
                    <div className="text-xs text-slate-300 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/40">
                      <strong className="text-slate-400 block mb-0.5">
                        Education:
                      </strong>
                      {res.education}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}