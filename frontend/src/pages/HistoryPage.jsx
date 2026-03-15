import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function History() {

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    let isMounted = true;

    api.get("/user/history")
      .then(res => {
        if (!isMounted) return;

        if (res.data?.success) {
          setAnalyses(res.data.history || []);
        } else {
          setAnalyses([]);
        }
      })
      .catch(err => {
        console.error(err);

        if (err?.response?.status === 401) {
          alert("Session expired. Please login again.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };

  }, []);

  if (loading) return <p className="p-6">Loading history...</p>;

  return (
    <div className="p-6 bg-[#f8faff] min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Analysis History
        </h1>
        <p className="text-gray-500 text-sm">
          View and manage your past resume analyses
        </p>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Top Section */}
        <div className="p-5 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">
            Recent Analyses
          </h2>
          <p className="text-sm text-gray-500">
            You have analyzed {analyses.length} resumes
          </p>
        </div>

        {analyses.length === 0 ? (
          <div className="p-6 text-gray-500">
            No analyses yet.
          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="px-6 py-3 font-semibold">Job Role</th>
                  <th className="px-6 py-3 font-semibold">
                    Overall Alignment Score
                  </th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">

                {analyses.map(a => {

                  const score = Math.round(
                    a.scores?.overallScore || 0
                  );

                  // Color logic
                  const scoreColor =
                    score >= 85
                      ? "bg-green-100 text-green-700"
                      : score >= 70
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700";

                  return (
                    <tr
                      key={a._id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* Job Role */}
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {a.jobRole || "Resume Analysis"}
                      </td>

                      {/* Overall Score */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${scoreColor}`}
                        >
                          {score}%
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            navigate("/result", { state: a })
                          }
                          className="text-blue-600 font-medium hover:underline"
                        >
                          View Result
                        </button>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}