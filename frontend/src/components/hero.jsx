import React from "react";
import { Link } from "react-router-dom";
const Hero = () => {
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
          <Link to="/form">
            <button
              className="
              px-6 py-3
              bg-[#FF6B35]
              text-white text-base sm:text-lg
              font-medium rounded-md
              hover:scale-105 transition
          "
            >
              Register
            </button>
          </Link>

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
    </section>
  );
};

export default Hero;
