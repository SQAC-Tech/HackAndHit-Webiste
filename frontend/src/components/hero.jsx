import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Hero = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    toast.info("Registrations Closed");
  };

  const handlePPT = () => {
    navigate("/submitppt");
  };

  return (
    <section
      id="home"
      className="
        relative flex items-center justify-center
        min-h-screen
        bg-[url('/stadium.svg')] bg-cover bg-center
        overflow-hidden
        px-6 sm:px-10 lg:px-16
      "
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-4xl text-center flex flex-col items-center gap-8 sm:gap-10">
        <h1
          className="
          text-white font-bold uppercase tracking-tight
          text-4xl sm:text-5xl md:text-6xl lg:text-7xl
          leading-tight
        "
        >
          Hack And Hit
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Register (closed) */}
          <button
            onClick={handleRegister}
            className="
              px-6 py-3
              bg-gray-600
              text-white text-base sm:text-lg
              font-medium rounded-md
              hover:scale-105 transition
            "
          >
            Register
          </button>

          {/* PPT Submission */}
          <button
            onClick={handlePPT}
            className="
              px-6 py-3
              bg-[#FF6B35]
              text-white text-base sm:text-lg
              font-medium rounded-md
              hover:scale-105 transition
            "
          >
            PPT Submission
          </button>

          {/* Learn More */}
          <a href="#domain">
            <button
              className="
                px-6 py-3
                border border-white/30
                text-white text-base sm:text-lg
                font-medium rounded-md
                hover:bg-white/10 transition
              "
            >
              Learn More
            </button>
          </a>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default Hero;
