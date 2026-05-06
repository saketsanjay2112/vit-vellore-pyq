import React, { useMemo, useState } from "react";

export default function VITSensePYQPortal() {
  const branches = [
    "VLSI DESIGN",
    "EMBEDDED SYSTEM",
    "AUTOMOTIVE",
    "INTELLIGENT COMM.",
    "POWER ELECTRONICS",
  ];

  const examTypes = ["FAT", "CAT1", "CAT2"];
  const semesters = [
    { value: "SEM1", label: "SEM1 • FALL SEMESTER" },
    { value: "SEM2", label: "SEM2 • WINTER SEMESTER" },
  ];

  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [subjectsByBranch, setSubjectsByBranch] = useState(() => {
    if (typeof window === "undefined") return {};

    try {
      const saved = localStorage.getItem("vit_pyq_subjects");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [newSubject, setNewSubject] = useState("");
  const [newProfessor, setNewProfessor] = useState("");
  const [newCredits, setNewCredits] = useState("");
  const [newSubjectSemester, setNewSubjectSemester] = useState("");

  const [uploadedPapers, setUploadedPapers] = useState(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = localStorage.getItem("vit_pyq_papers");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleAddSubject = () => {
    if (!branch || !newSubject || !newCredits || !newProfessor || !newSubjectSemester) {
      alert("Branch, Subject, Semester, Professor Name and Credits are mandatory.");
      return;
    }

    const updated = {
      ...subjectsByBranch,
      [branch]: [
        ...(subjectsByBranch[branch] || []),
        {
          name: newSubject,
          credits: Number(newCredits),
          professor: newProfessor,
          semester: newSubjectSemester,
        },
      ],
    };

    setSubjectsByBranch(updated);
    setNewSubject("");
    setNewCredits("");
    setNewProfessor("");
    setNewSubjectSemester("");

    alert("Subject added successfully.");
  };

  const handleUpload = () => {
    if (
      !branch ||
      !subject ||
      !examType ||
      !semester ||
      !year ||
      !selectedFile ||
      !comment
    ) {
      alert("Every field is mandatory.");
      return;
    }

    const fileUrl = URL.createObjectURL(selectedFile);

    const subjectDetails = (subjectsByBranch[branch] || []).find(
      (s) => s.name === subject
    );

    const newPaper = {
      id: Date.now(),
      branch,
      subject,
      examType,
      semester,
      year,
      credits: subjectDetails?.credits || 0,
      professor: subjectDetails?.professor || "",
      fileName: selectedFile.name,
      fileUrl,
      comment,
      uploadTime: new Date().toLocaleString(),
    };

    setUploadedPapers((prev) => [...prev, newPaper]);

    setSelectedFile(null);
    setComment("");
    setYear("");

    document.getElementById("fileInput").value = "";

    alert("Paper uploaded successfully.");
  };

  const availableSubjects = subjectsByBranch[branch] || [];

  const filteredPapers = uploadedPapers.filter(
    (paper) =>
      paper.branch === branch &&
      paper.subject === subject &&
      paper.examType === examType &&
      paper.semester === semester
  );

  const dashboardStats = useMemo(() => {
    return branches.map((branchName) => {
      const branchSubjects = subjectsByBranch[branchName] || [];

      const sem1Credits = branchSubjects
        .filter((sub) => sub.semester === "SEM1")
        .reduce((sum, sub) => sum + Number(sub.credits), 0);

      const sem2Credits = branchSubjects
        .filter((sub) => sub.semester === "SEM2")
        .reduce((sum, sub) => sum + Number(sub.credits), 0);

      const totalPapers = uploadedPapers.filter(
        (paper) => paper.branch === branchName
      ).length;

      const fatCount = uploadedPapers.filter(
        (paper) =>
          paper.branch === branchName && paper.examType === "FAT"
      ).length;

      const cat1Count = uploadedPapers.filter(
        (paper) =>
          paper.branch === branchName && paper.examType === "CAT1"
      ).length;

      const cat2Count = uploadedPapers.filter(
        (paper) =>
          paper.branch === branchName && paper.examType === "CAT2"
      ).length;

      const years = [
        ...new Set(
          uploadedPapers
            .filter((paper) => paper.branch === branchName)
            .map((paper) => paper.year)
        ),
      ];

      return {
        branchName,
        sem1Credits,
        sem2Credits,
        totalPapers,
        fatCount,
        cat1Count,
        cat2Count,
        years,
      };
    });
  }, [uploadedPapers, subjectsByBranch]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
      "vit_pyq_subjects",
      JSON.stringify(subjectsByBranch)
    );
  }, [subjectsByBranch]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
      "vit_pyq_papers",
      JSON.stringify(uploadedPapers)
    );
  }, [uploadedPapers]);

  const isSelectionComplete =
    branch && subject && examType && semester;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#07111f] to-[#0d2233] text-white p-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>
      <div className="max-w-[1700px] mx-auto space-y-14 px-6 lg:px-12">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-[42px] p-12 lg:p-16 shadow-[0_0_50px_rgba(0,255,255,0.08)] relative z-10">
          <div className="text-center mb-10 relative">
            <div className="inline-block px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm tracking-[0.3em] uppercase mb-5 shadow-lg">
              VIT Vellore • Reference Repository
            </div>

            <h1 className="text-6xl md:text-7xl font-black tracking-[0.25em] uppercase bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] animate-pulse">
              VIT VELLORE
            </h1>

            <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-[0.4em] text-white/90 uppercase">
              MTECH PYQ PORTAL
            </h2>

            <p className="text-zinc-400 mt-6 max-w-3xl mx-auto text-lg leading-relaxed">
              Reference platform created for VIT Vellore MTECH students to organize and access previous year question papers branch-wise, subject-wise and semester-wise. This is not an official VIT platform.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-[34px] p-8 backdrop-blur-xl hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 shadow-[0_0_35px_rgba(0,255,255,0.08)]">
                <h3 className="text-cyan-300 text-lg font-bold tracking-wide">
                  Smart Uploads
                </h3>
                <p className="text-zinc-400 text-sm mt-2">
                  Upload papers with year tagging, semester filtering and subject mapping.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-400/20 rounded-[34px] p-8 backdrop-blur-xl hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 shadow-[0_0_35px_rgba(0,255,255,0.08)]">
                <h3 className="text-purple-300 text-lg font-bold tracking-wide">
                  VIT Vellore Dashboard
                </h3>
                <p className="text-zinc-400 text-sm mt-2">
                  Track PYQ uploads, semester credits, subjects and available academic years in one clean dashboard.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-[34px] p-8 backdrop-blur-xl hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 shadow-[0_0_35px_rgba(0,255,255,0.08)]">
                <h3 className="text-blue-300 text-lg font-bold tracking-wide">
                  Student Reference Access
                </h3>
                <p className="text-zinc-400 text-sm mt-2">
                  View uploaded PYQs in fullscreen mode and download instantly.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-cyan-500/20 rounded-3xl p-6 mb-8 overflow-auto shadow-[0_0_35px_rgba(0,255,255,0.06)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-3xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Dashboard Overview
              </h2>
            </div>

            <table className="w-full text-base border-separate border-spacing-y-4">
              <thead>
                <tr className="bg-zinc-800 text-zinc-200">
                  <th className="p-3 text-left">Branch</th>
                  <th className="p-4 text-left">FALL Semester Credits</th>
                  <th className="p-4 text-left">WINTER Semester Credits</th>
                  <th className="p-3 text-left">FAT Papers</th>
                  <th className="p-3 text-left">CAT1 Papers</th>
                  <th className="p-3 text-left">CAT2 Papers</th>
                  <th className="p-3 text-left">Total Papers</th>
                  <th className="p-3 text-left">Years Available</th>
                </tr>
              </thead>

              <tbody>
                {dashboardStats.map((item) => (
                  <tr
                    key={item.branchName}
                    className="bg-white/5 backdrop-blur-lg hover:bg-cyan-500/10 transition-all duration-300 rounded-2xl"
                  >
                    <td className="p-3 font-semibold text-cyan-300">
                      {item.branchName}
                    </td>
                    <td className="p-3 font-semibold text-cyan-200">{item.sem1Credits}</td>
                    <td className="p-3 font-semibold text-blue-200">{item.sem2Credits}</td>
                    <td className="p-3">{item.fatCount}</td>
                    <td className="p-3">{item.cat1Count}</td>
                    <td className="p-3">{item.cat2Count}</td>
                    <td className="p-3">{item.totalPapers}</td>
                    <td className="p-3">
                      {item.years.length > 0
                        ? item.years.join(", ")
                        : "No Uploads"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white/5 border border-cyan-400/10 rounded-[38px] p-10 mb-10 backdrop-blur-2xl shadow-[0_0_45px_rgba(0,255,255,0.05)]">
            <h2 className="text-2xl font-bold text-cyan-300 mb-5">
              Developer Subject Management
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-8">
              <select
                value={branch}
                onChange={(e) => {
                  setBranch(e.target.value);
                  setSubject("");
                  setExamType("");
                  setSemester("");
                }}
                className="bg-zinc-900/90 border border-cyan-500/20 rounded-2xl px-4 py-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 shadow-lg"
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Enter Subject Name"
                className="bg-zinc-900/90 border border-cyan-500/20 rounded-2xl px-4 py-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 shadow-lg"
              />

              <select
                value={newSubjectSemester}
                onChange={(e) => setNewSubjectSemester(e.target.value)}
                className="bg-zinc-900/90 border border-cyan-500/20 rounded-2xl px-4 py-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 shadow-lg"
              >
                <option value="">Subject Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.value} value={sem.value}>
                    {sem.label}
                  </option>
                ))}
              </select>

              <input
                value={newProfessor}
                onChange={(e) => setNewProfessor(e.target.value)}
                placeholder="Professor Name"
                className="bg-zinc-900/90 border border-cyan-500/20 rounded-2xl px-4 py-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 shadow-lg"
              />

              <input
                type="number"
                value={newCredits}
                onChange={(e) => setNewCredits(e.target.value)}
                placeholder="Credits"
                className="bg-zinc-900/90 border border-cyan-500/20 rounded-2xl px-4 py-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 shadow-lg"
              />

              <button
                onClick={handleAddSubject}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition-all duration-300 rounded-2xl font-bold tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.4)]"
              >
                Add Subject
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            <select
              value={branch}
              onChange={(e) => {
                setBranch(e.target.value);
                setSubject("");
                setExamType("");
                setSemester("");
              }}
              className="bg-zinc-900/90 border border-cyan-500/20 rounded-2xl px-4 py-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 shadow-lg"
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={subject}
              disabled={!branch}
              onChange={(e) => {
                setSubject(e.target.value);
                setExamType("");
                setSemester("");
              }}
              className="bg-white/5 border border-cyan-400/20 rounded-2xl px-5 py-4 disabled:opacity-40 text-cyan-100 backdrop-blur-xl hover:border-cyan-300/40 hover:bg-cyan-500/10 transition-all duration-500 shadow-xl"
            >
              <option value="">Select Subject</option>
              {availableSubjects.map((sub) => (
                <option key={sub.name} value={sub.name}>
                  {sub.name} • {sub.professor} • {sub.semester} • ({sub.credits} Credits)
                </option>
              ))}
            </select>

            <select
              value={examType}
              disabled={!subject}
              onChange={(e) => {
                setExamType(e.target.value);
                setSemester("");
              }}
              className="bg-white/5 border border-cyan-400/20 rounded-2xl px-5 py-4 disabled:opacity-40 text-cyan-100 backdrop-blur-xl hover:border-cyan-300/40 hover:bg-cyan-500/10 transition-all duration-500 shadow-xl"
            >
              <option value="">Select Exam Type</option>
              {examTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={semester}
              disabled={!examType}
              onChange={(e) => setSemester(e.target.value)}
              className="bg-white/5 border border-cyan-400/20 rounded-2xl px-5 py-4 disabled:opacity-40 text-cyan-100 backdrop-blur-xl hover:border-cyan-300/40 hover:bg-cyan-500/10 transition-all duration-500 shadow-xl"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem.value} value={sem.value}>
                    {sem.label}
                  </option>
              ))}
            </select>
          </div>

          {isSelectionComplete && (
            <div className="bg-white/5 border border-cyan-400/10 rounded-[38px] p-10 backdrop-blur-2xl shadow-[0_0_45px_rgba(0,255,255,0.05)]">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">
                Upload / View Papers
              </h2>

              <p className="text-zinc-400 mb-6">
                Flow: {branch} → {subject} → {examType} → {semester}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Mention Paper Year (Example: 2025)"
                  className="bg-zinc-900/90 border border-cyan-500/20 rounded-2xl px-4 py-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 shadow-lg"
                />

                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="bg-zinc-900/90 border border-cyan-500/20 rounded-2xl px-4 py-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 shadow-lg"
                />
              </div>

              <textarea
                rows="4"
                value={comment}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/);

                  if (words.length <= 50 || e.target.value === "") {
                    setComment(e.target.value);
                  }
                }}
                placeholder="Enter personal note about this paper (50 words max)"
                className="w-full bg-white/5 border border-cyan-400/20 rounded-3xl px-6 py-5 mb-8 text-cyan-100 backdrop-blur-xl hover:border-cyan-300/40 transition-all duration-500 shadow-xl"
              />

              <button
                onClick={handleUpload}
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500 hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl font-black tracking-[0.15em] uppercase shadow-[0_0_25px_rgba(34,211,238,0.4)]"
              >
                Upload Paper
              </button>

              <div className="mt-10 space-y-5">
                {filteredPapers.length === 0 ? (
                  <div className="bg-zinc-900 border border-dashed border-zinc-700 rounded-2xl p-8 text-center text-zinc-500">
                    No uploaded papers found.
                  </div>
                ) : (
                  filteredPapers.map((paper, index) => (
                    <div
                      key={paper.id}
                      className="bg-gradient-to-br from-white/5 to-cyan-500/5 border border-cyan-400/10 rounded-[32px] p-8 hover:scale-[1.01] transition-all duration-500 shadow-[0_0_30px_rgba(0,255,255,0.05)]"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-5">
                        <div>
                          <h3 className="text-xl font-bold text-cyan-300">
                            Paper #{index + 1}
                          </h3>

                          <p className="text-zinc-300 mt-2">
                            {paper.fileName}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3 text-sm">
                            <span className="bg-cyan-900 px-3 py-1 rounded-full">
                              {paper.subject}
                            </span>

                            <span className="bg-purple-900 px-3 py-1 rounded-full text-purple-200">
                              Prof. {paper.professor || "Faculty"}
                            </span>

                            <span className="bg-zinc-800 px-3 py-1 rounded-full">
                              {paper.examType}
                            </span>

                            <span className="bg-zinc-800 px-3 py-1 rounded-full">
                              {paper.semester === "SEM1"
                                ? "FALL SEMESTER"
                                : "WINTER SEMESTER"}
                            </span>

                            <span className="bg-yellow-700 px-3 py-1 rounded-full font-bold">
                              YEAR {paper.year}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <button
                            onClick={() => setPreviewUrl(paper.fileUrl)}
                            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg"
                          >
                            View Full Screen
                          </button>

                          <a
                            href={paper.fileUrl}
                            download={paper.fileName}
                            className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg"
                          >
                            Download
                          </a>
                        </div>
                      </div>

                      <div className="mt-5 bg-black border border-zinc-800 rounded-xl p-4">
                        <p className="text-zinc-400 text-sm mb-1">
                          Personal Comment
                        </p>

                        <p className="text-zinc-200 text-sm leading-relaxed">
                          {paper.comment}
                        </p>
                      </div>

                      <div className="mt-4 text-red-400 text-xs">
                        Uploaded papers are permanent and cannot be deleted.
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {previewUrl && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-zinc-700">
            <h2 className="text-xl font-bold">Paper Preview</h2>

            <button
              onClick={() => setPreviewUrl(null)}
              className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg"
            >
              Close
            </button>
          </div>

          <iframe
            src={previewUrl}
            title="Paper Preview"
            className="w-full h-full bg-white"
          />
        </div>
      )}
    </div>
  );
}
