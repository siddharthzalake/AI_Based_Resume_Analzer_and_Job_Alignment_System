import { Link } from "react-router-dom";
import { BarChart3, Target, Sparkles, FileSearch,ArrowRight } from "lucide-react"; 
// Icons for visual feature cards (no logic impact)

export default function HomeContent() {
  return (
    <div>

      {/* HERO SECTION — Main landing call-to-action */}
      <section className="pt-20 pb-16 px-4 text-center">

        {/* Small AI badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-100 shadow-sm mb-6">
          <Sparkles size={14} className="text-blue-500" />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Powered by Advanced AI
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto">
          AI Powered <br /> Resume Analyzer
        </h1>

        {/* Short description */}
        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your resume and compare it with a job description to get ATS score,
          skill match analysis, and personalized improvement suggestions.
        </p>

        {/* Primary navigation buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">

          {/* Navigate to analysis page */}
          <Link
            to="/analyze"
            className="group bg-[#0052cc] hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:-translate-y-1"
          >
            Analyze Resume <span>→</span>
          </Link>

          {/* Navigate to history page */}
          <Link
            to="/history"
            className="bg-white border border-gray-200 hover:border-blue-200 text-gray-700 px-10 py-4 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            View Past Analysis
          </Link>

        </div>
      </section>


      {/* FEATURES SECTION — Explains product capabilities */}
      <section className="py-20 px-4 max-w-6xl mx-auto">

        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Everything you need to land your dream job
          </h2>
          <p className="text-gray-500">
            Our AI-powered tools analyze every aspect of your resume to help you stand out.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Individual feature components */}
          <FeatureCard
            icon={<BarChart3 className="text-blue-500" />}
            title="ATS Score Analysis"
            desc="Get an instant ATS compatibility score to ensure your resume passes automated screening systems."
          />

          <FeatureCard
            icon={<Target className="text-blue-500" />}
            title="Skill Gap Detection"
            desc="Identify missing skills from your resume compared to job requirements and industry standards."
          />

          <FeatureCard
            icon={<Sparkles className="text-blue-500" />}
            title="AI Resume Suggestions"
            desc="Receive AI-powered recommendations to improve your resume content and formatting."
          />

          <FeatureCard
            icon={<FileSearch className="text-blue-500" />}
            title="Job Description Matching"
            desc="Compare your resume against specific job descriptions for tailored optimization insights."
          />

        </div>
      </section>


      {/* SECTION 2: HOW IT WORKS — Separate Visual Process */}
      <section className="py-24 bg-white border-y border-gray-100/80 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-4">How It Works</h2>
             <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-black text-2xl mb-6 shadow-sm border border-blue-100 transition-all group-hover:bg-[#0052cc] group-hover:text-white group-hover:rotate-3">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0f172a]">Upload Resume</h3>
              <p className="text-gray-500 text-sm max-w-[220px] text-center leading-relaxed">
                Securely upload your resume in PDF format to our secure AI engine.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-black text-2xl mb-6 shadow-sm border border-blue-100 transition-all group-hover:bg-[#0052cc] group-hover:text-white group-hover:-rotate-3">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0f172a]">Add Job Details</h3>
              <p className="text-gray-500 text-sm max-w-[220px] text-center leading-relaxed">
                Paste the target job description to analyze specific keyword alignment.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl mb-6 shadow-lg shadow-blue-200 transition-all group-hover:scale-110">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0f172a]">Get Results</h3>
              <p className="text-gray-500 text-sm max-w-[220px] text-center leading-relaxed">
                Receive your comprehensive ATS score and actionable AI improvement tips.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}


// ======================================================
// Reusable Feature Card Component
// ======================================================
function FeatureCard({ icon, title, desc }) {
  return (
    // Static presentational component (no state)
    <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-2 hover:border-blue-200 text-left">

      {/* Icon container */}
      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 transition-colors group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      {/* Feature title */}
      <h3 className="text-xl font-bold mb-4 text-[#0f172a] group-hover:text-blue-600 transition-colors">
        {title}
      </h3>

      {/* Feature description */}
      <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600 transition-colors">
        {desc}
      </p>

    </div>
  );
}