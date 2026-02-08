import React from "react";

const domains = [
  {
    title: "FinTech",
    tagline: "Run Rate",
    description:
      "Innovate financial systems that scale fast, optimize value flow, and keep the economy scoring consistently.",
  },
  {
    title: "EdTech",
    tagline: "Think Tank",
    description:
      "Reimagine learning experiences through technology that educates, empowers, and evolves minds.",
  },
  {
    title: "Open Innovation",
    tagline: "Free Hit",
    description:
      "No boundaries. No restrictions. Build bold, disruptive ideas that redefine the game.",
  },
  {
    title: "AgriTech",
    tagline: "Outfield",
    description:
      "Transform agriculture with smart, sustainable solutions that support growth from the ground up.",
  },
  {
    title: "Blockchain",
    tagline: "Decentralized Dugout",
    description:
      "Design trustless systems, transparent ecosystems, and decentralized futures.",
  },
  {
    title: "Healthcare",
    tagline: "Vital Innings",
    description:
      "Create impactful health-tech solutions where every innovation can save a life.",
  },
];

const DomainCard = ({ title, tagline, description }) => {
  return (
    <div className="
      group
      relative
      flex flex-col
      gap-6
      p-8
      rounded-2xl
      bg-white/5
      backdrop-blur-md
      border border-white/10
      transition-all duration-300
      hover:-translate-y-3
      hover:border-white/30
      hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]
    ">
      <div className="flex flex-col gap-2">
        <h3 className="text-white text-3xl font-bold tracking-tight">
          {title}
        </h3>
        <span className="text-sm uppercase tracking-widest text-emerald-400">
          {tagline}
        </span>
      </div>

      <p className="text-white/70 text-base leading-relaxed">
        {description}
      </p>

      {/* Hover Accent Line */}
      <div className="
        absolute bottom-0 left-0
        h-[2px] w-0
        bg-emerald-400
        transition-all duration-300
        group-hover:w-full
      " />
    </div>
  );
};

const Domain = () => {
  return (
    <section className="w-full bg-[#041323] px-16 py-28">
      {/* Heading */}
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h2 className="text-white text-5xl font-extrabold tracking-tight">
          Domains & Themes
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="
        max-w-6xl mx-auto
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        gap-10
      ">
        {domains.map((domain, index) => (
          <DomainCard key={index} {...domain} />
        ))}
      </div>

      
    </section>
  );
};

export default Domain;
