import { useState } from "react";
import api from "../api/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Sparkles, Loader2, BrainCircuit } from "lucide-react";

export default function Analyze() {
  // Form state
  const [mode, setMode] = useState("jd");
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const navigate = useNavigate();

  // Handles resume submission and API call
  const submit = async () => {
    if (!file) return toast.error("Please upload your resume");

    setIsLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    let endpoint = mode === "jd" ? "/analyze-with-jd" : "/analyze-resume";

    if (mode === "jd") {
      if (!jd.trim() || !role.trim()) {
        setIsLoading(false);
        return toast.error("Please fill in Job Role and Description");
      }
      formData.append("jobDescription", jd);
      formData.append("companyName", company);
      formData.append("jobRole", role);
    }

    try {
      const res = await api.post(endpoint, formData);
      toast.success("Analysis completed");

      // Navigate to result page with analysis data
      navigate("/result", { state: res.data.analysis });

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Analysis failed");
    } finally {
     
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8faff] py-12 px-4">
      
      {/* Full-screen loading overlay while AI processing */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md transition-all">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
            
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-blue-100 flex items-center justify-center">
              <BrainCircuit className="text-blue-600 animate-pulse" size={60} />
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Loader2 className="animate-spin text-blue-600" size={24} />
              AI is scanning your resume...
            </h2>
            <p className="text-gray-500 mt-2 font-medium tracking-wide">
              Comparing keywords and calculating match scores
            </p>
          </div>

          {/* Animated progress bar ) */}
          <div className="mt-8 w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`max-w-4xl mx-auto transition-all duration-500 ${isLoading ? 'blur-sm scale-95 opacity-50' : ''}`}>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-[#0f172a] mb-2">Resume Analysis</h2>

            {/* Dynamic description based on selected mode */}
            <p className="text-gray-500 text-sm">
              {mode === "jd" 
                ? "Compare your resume against a specific job description." 
                : "Get a general analysis and improvement tips for your resume."}
            </p>
          </div>

      
          <div className="flex bg-gray-200/50 p-1 rounded-xl w-fit border border-gray-200">
            <button
              onClick={() => setMode("jd")}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === "jd" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              With JD
            </button>

            <button
              onClick={() => setMode("resume")}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === "resume" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Resume Only
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8">
            
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FileText size={20} className="text-blue-500" />
              Upload Your Resume
            </h3>

            <div className="mb-8">
              
              {/* Drag-and-drop file upload area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-10 transition-all text-center ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50/50"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const droppedFile = e.dataTransfer.files[0];

                  if (allowedTypes.includes(droppedFile?.type)) {
                    setFile(droppedFile);
                  } else {
                    toast.error("Only PDF, DOC, DOCX allowed");
                  }
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  disabled={isLoading}
                  onChange={(e) => {
                    const selected = e.target.files[0];

                    if (!allowedTypes.includes(selected?.type)) {
                      toast.error("Only PDF, DOC, DOCX allowed");
                      return;
                    }

                    setFile(selected);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Upload size={24} />
                  </div>

                  
                  <p className="text-sm font-medium text-gray-700">
                    {file ? file.name : "Drop your resume here or click to browse"}
                  </p>

                 
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF or Docx only (Max 10MB)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Description inputs  */}
            {mode === "jd" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
                    <input
                      disabled={isLoading}
                      placeholder="e.g., Software Engineer"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                    <input
                      disabled={isLoading}
                      placeholder="e.g., Microsoft"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                  <textarea
                    disabled={isLoading}
                    placeholder="Paste the requirements here..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    onChange={(e) => setJd(e.target.value)}
                  />
                </div>

              </div>
            )}
          </div>

          {/* Submit button */}
          <div className="px-8 pb-8">
            <button
              onClick={submit}
              disabled={isLoading}
              className={`w-full font-bold py-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 ${
                isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0052cc] hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              
              {isLoading 
                ? "Processing..." 
                : mode === "jd" 
                  ? "Analyze Against Job" 
                  : "General Resume Analysis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
