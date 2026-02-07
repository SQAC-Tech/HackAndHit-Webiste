import React from "react";

const Hero = () => {
  return (
    <section className="flex flex-row justify-center items-center px-16 py-0 w-full h-[900px] bg-[url('hero-bg.png')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="flex flex-col items-center p-0 gap-20 w-[1280px] max-w-[1280px] h-[277px] relative z-10">
        <div className="flex flex-col items-center p-0 gap-6 w-[768px] max-w-[768px] h-[198px]">
          <h1 className="w-[768px] h-[84px] text-white text-[84px] font-bold leading-[100%] text-center uppercase tracking-[-0.01em]">
            Hack And Hit
          </h1>
          <p className="w-[768px] h-[90px] text-white text-[20px] font-normal leading-[150%] text-center">
            Code like you're chasing a world cup. Hack and Hit brings the
            intensity of T20 cricket to the hackathon floor, where speed meets
            skill and only the sharpest teams survive.
          </p>
        </div>
        <div className="flex flex-row items-start p-0 gap-4 w-[282px] h-[47px]">
          <button className="flex flex-row justify-center items-center px-6 py-2.5 gap-2 w-[120px] h-[47px] bg-[#FF6B35] border border-[#FF6B35] text-white text-[18px] font-medium leading-[150%]">
            Register
          </button>
          <button className="flex flex-row justify-center items-center px-6 py-2.5 gap-2 w-[146px] h-[47px] border border-white/20 text-white text-[18px] font-medium leading-[150%]">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
