import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  FileText,
  TrendingUp,
  Sparkles
} from "lucide-react";

export default function Result() {
  const location = useLocation();

  const [analysis, setAnalysis] = useState(
    location.state || JSON.parse(localStorage.getItem("analysisData"))
  );

  useEffect(() => {
    if (location.state) {
      localStorage.setItem(
        "analysisData",
        JSON.stringify(location.state)
      );
      setAnalysis(location.state);
    }
  }, [location.state]);

  if (!analysis) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8faff] p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border w-full max-w-md">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <p className="text-xl font-semibold text-gray-800">No analysis data found</p>
          <p className="text-gray-500 mt-2">Please upload your resume again.</p>
        </div>
      </div>
    );
  }

  const scores = analysis.scores || {};

  return (
    <div className="min-h-screen bg-[#f8faff] p-4 md:p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* --- RESUME PREVIEW (Force top on mobile with order-1) --- */}
        <div className="lg:col-span-5 xl:col-span-5 order-1">
          <div className="lg:sticky lg:top-24 bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="text-blue-600" size={20} />
              <h2 className="text-xl font-bold text-gray-800">Resume Preview</h2>
            </div>

            {/* Controlled height for mobile so it doesn't scroll forever */}
            <div className="border border-gray-200 rounded-lg overflow-auto bg-gray-50 h-[450px] lg:h-[80vh]">
              {analysis.previewImageUrl ? (
                analysis.previewImageUrl.includes("docs.google.com") ? (
                  <iframe
                    src={analysis.previewImageUrl}
                    title="Resume Preview"
                    className="w-full h-full border-0"
                  />
                ) : (
                  <img
                    src={analysis.previewImageUrl}
                    alt="Resume"
                    className="w-full h-auto min-h-full object-contain"
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FileText size={40} strokeWidth={1} />
                  <p className="text-xs mt-2">Preview not available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- ANALYSIS DASHBOARD (Force below resume on mobile with order-2) --- */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6 lg:space-y-8 order-2">

          {/* MAIN SCORE CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="relative flex items-center justify-center w-28 h-28 md:w-32 md:h-32 rounded-full border-8 border-blue-50 shrink-0">
              <span className="text-3xl md:text-4xl font-extrabold text-blue-600">
                {Math.round(scores.overallScore || 0)}%
              </span>
              <div className="absolute -bottom-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap">
                Overall
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Analysis Complete!
              </h1>
              <p className="text-gray-500 text-sm md:text-base max-w-md">
                Your resume shows strong alignment with the role.
                Review the gaps identified below.
              </p>
            </div>
          </div>

          {/* SCORE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ScoreCard label="ATS Score" value={scores.atsScore} icon={<CheckCircle2 size={16} />} />
            <ScoreCard label="Semantic Match" value={scores.semanticScore} icon={<TrendingUp size={16} />} />
            <ScoreCard label="Keyword Match" value={scores.keywordMatch} icon={<FileText size={16} />} />
          </div>

          {/* ANALYSIS CONTENT SECTIONS */}
          <div className="space-y-6">
            <AnalysisSection
              title="Missing Key Skills"
              icon={<AlertCircle size={20} />}
              colorClass="text-red-600"
              data={analysis.missingSkills}
              type="skill"
            />

            <AnalysisSection
              title="Content Improvements"
              icon={<Lightbulb size={20} />}
              colorClass="text-amber-600"
              data={analysis.contentSuggestions}
              type="suggestion"
            />

            <AnalysisSection
              title="ATS Optimization"
              icon={<CheckCircle2 size={20} />}
              colorClass="text-green-600"
              data={analysis.atsSuggestions}
              type="tip"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Section Component for cleaner code
function AnalysisSection({ title, icon, colorClass, data, type }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 md:p-6 border-b border-gray-50 bg-gray-50/30">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${colorClass}`}>
          {icon} {title}
        </h3>
      </div>
      <div className="p-4 md:p-6 space-y-4">
        {data?.length > 0 ? (
          data.map((item, i) => (
            <div key={i} className="flex items-start gap-3 md:gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass.replace('text', 'bg')}/10 ${colorClass}`}>
                {type === 'skill' ? <span className="text-xs font-bold">+</span> : <Sparkles size={14} />}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm md:text-base">
                  {type === 'skill' ? item : `${title.split(' ')[0]} Point ${i + 1}`}
                </h4>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {type === 'skill' ? "Add this skill to your resume to improve keyword matching." : item}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm italic">No data available.</p>
        )}
      </div>
    </section>
  );
}

function ScoreCard({ label, value, icon }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm">
      <div className="flex items-center gap-2 text-gray-500 mb-2 md:mb-3">
        {icon}
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl md:text-2xl font-black text-gray-900">
        {value != null ? `${Math.round(value)}%` : "--"}
      </p>
    </div>
  );
}
