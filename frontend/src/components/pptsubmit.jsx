import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PPTSubmit = () => {
  const team = JSON.parse(localStorage.getItem("team"));
  const [pptLink, setPptLink] = useState("");
  const [loading, setLoading] = useState(false);

  if (!team) {
    return (
      <div className="min-h-screen bg-[#041323] flex items-center justify-center text-white">
        Unauthorized
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!pptLink.trim()) {
      toast.error("Please provide a PPT link");
      return;
    }

    setLoading(true);

    try {
      await axios.patch("https://hackandhit-webiste.onrender.com/api/ppt-submit", {
        email: team.leader.email,
        pptLink,
      });

      toast.success("PPT submitted successfully!");
      setPptLink("");
    } catch (err) {
      toast.error("Submission failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="min-h-screen bg-[#041323] px-6 py-20 flex justify-center">
        <div
          className="
            w-full max-w-2xl
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-2xl
            p-10
            shadow-[0_30px_80px_rgba(0,0,0,0.45)]
          "
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-white text-4xl font-bold">
              PPT Submission
            </h1>
            <p className="mt-4 text-white/60">
              Upload your final presentation before the deadline
            </p>
          </div>

          {/* Template */}
          <div
            className="
              flex flex-col sm:flex-row
              justify-between items-center
              gap-6
              mb-12
              bg-white/5
              border border-white/10
              rounded-xl
              p-6
            "
          >
            <div>
              <h3 className="text-white text-xl font-semibold">
                PPT Template
              </h3>
              <p className="text-white/60 text-sm mt-1">
                Use the official Hack & Hit presentation format
              </p>
            </div>

            <a
              href="https://your-template-link-here"
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-6 py-3
                rounded-lg
                bg-emerald-500
                text-[#041323]
                font-semibold
                transition
                hover:bg-emerald-400
              "
            >
              Open Template
            </a>
          </div>

          {/* Submission */}
          <div className="flex flex-col gap-4">
            <label className="text-white/70 text-sm">
              PPT Share Link (Google Drive / OneDrive)
            </label>

            <input
              type="url"
              placeholder="https://drive.google.com/..."
              value={pptLink}
              onChange={(e) => setPptLink(e.target.value)}
              className="
                w-full
                px-4 py-3
                rounded-lg
                bg-white/10
                border border-white/10
                text-white
                placeholder:text-white/40
                outline-none
                transition
                focus:border-emerald-400/60
                focus:ring-1 focus:ring-emerald-400/30
              "
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`
                mt-6 w-full py-3 rounded-lg
                font-semibold text-lg
                transition
                ${
                  loading
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98]"
                }
                text-[#041323]
              `}
            >
              {loading ? "Submitting..." : "Submit PPT"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PPTSubmit;
