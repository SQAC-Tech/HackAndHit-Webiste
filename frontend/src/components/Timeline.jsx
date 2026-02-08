import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import trophyImage from "../assests/download__7_-removebg-preview.png";
import leftImage from "../../public/image.png";

const Timeline = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const stages = [
    {
      title: "Launch & Registration",
      description: "Registration opens and teams begin forming their squads.",
      chips: [
        { label: "Registration", tooltip: "Sign up and form your team" },
        { label: "Team Formation", tooltip: "Assemble your squad" },
      ],
      commentary: "The tournament begins with anticipation in the air.",
    },
    {
      title: "Screening & PPT evaluation",
      description:
        "Screening and elimination rounds to select the the best Ideas",
      chips: [
        { label: "PPT", tooltip: "Non-stop coding marathon" },
        { label: "Idea", tooltip: "Problem statement revealed" },
      ],
      commentary: "Toss.",
    },
    {
      title: "PITCHING & CODING",
      description: "Teams code, debug, and iterate with mentor support.",
      chips: [
        { label: "Team Work", tooltip: "Collaborative development" },
        { label: "Mentor Support", tooltip: "Guidance throughout" },
      ],
      commentary: "Steady partnerships forming in the middle overs.",
    },
    {
      title: "BUILDING",
      description: "Time's up. Final solutions are submitted.",
      chips: [
        { label: "Deadline", tooltip: "Final submission window" },
        { label: "Code Freeze", tooltip: "No more changes allowed" },
      ],
      commentary: "The innings come to a close, submissions locked in.",
    },
    {
      title: "DEMO & RESULTS",
      description: "Live demos, judging, and winners announced.",
      chips: [
        { label: "Live Demo", tooltip: "Present your solution" },
        { label: "Evaluation", tooltip: "Judging by experts" },
      ],
      commentary: "The final moments, where champions are crowned.",
    },
  ];

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="bg-gradient-to-b from-[#041323] to-slate-950 py-16 px-4 md:px-8 relative"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start relative z-10">
        <div className="text-left sticky top-16">
          <p className="text-slate-300 text-sm uppercase tracking-wide mb-4">
            Timeline
          </p>
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 leading-tight">
            FIVE STAGES TO VICTORY
          </h2>
          <div className="relative top-10">
            <div className="hidden md:flex justify-center sticky top-24">
              <img
                src="/Left_side_image.png"
                alt="Timeline Illustration"
                className="w-64 absolute top-[-200px] left-[-60px] h-400 lg:w-72 xl:w-[800px] object-contain opacity-80 rounded-xl shadow-lg "
              />
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Trophy */}
          <motion.div
            className="block absolute bottom-0 left-[-100px] w-1/4 h-1/2 z-20 pointer-events-none flex items-end justify-start pl-4"
            style={{ opacity: 1 }}
          >
            <img
              src={trophyImage}
              alt="Trophy"
              className="w-full h-auto object-contain filter brightness-50"
            />
          </motion.div>

          {/* Vertical Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0 border-l-2 border-dashed border-white/20 md:transform md:-translate-x-1/2"></div>
          <motion.div
            className="absolute left-0 md:left-1/2 top-0 w-0 border-l-2 border-dashed border-white md:transform md:-translate-x-1/2 origin-top"
            style={{ height: progressHeight }}
          ></motion.div>

          {/* Cricket Pitch Background */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-full transform -translate-x-1/2 z-0 pointer-events-none">
            <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-green-700/25 to-transparent"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-green-700/25 to-transparent"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-10 transform -translate-x-1/2 bg-gradient-to-b from-yellow-800/25 via-yellow-600/15 to-yellow-900/30"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-900/15 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-slate-800/16 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/15 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-600/13 to-transparent"></div>
            {/* Wickets */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
              <div className="w-0.5 h-6 bg-white/28"></div>
              <div className="w-0.5 h-6 bg-white/28"></div>
              <div className="w-0.5 h-6 bg-white/28"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
              <div className="w-0.5 h-6 bg-white/28"></div>
              <div className="w-0.5 h-6 bg-white/28"></div>
              <div className="w-0.5 h-6 bg-white/28"></div>
            </div>
          </div>

          <div className="space-y-12 md:space-y-16">
            {stages.map((stage, index) => {
              const isEven = index % 2 === 0;
              const ref = useRef(null);
              const isInView = useInView(ref, { once: true, margin: "-100px" });
              const activeProgress = useTransform(
                scrollYProgress,
                [index * 0.2, (index + 1) * 0.2],
                [0, 1],
              );

              return (
                <motion.div
                  key={index}
                  ref={ref}
                  className={`relative flex items-center ${
                    isEven ? "justify-start" : "justify-end"
                  } md:flex-row flex-col`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Timeline Dot */}
                  <motion.div
                    className="absolute left-2 md:left-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white md:transform md:-translate-x-1/2 z-10"
                    style={{
                      scale: useTransform(activeProgress, [0, 1], [1, 1.2]),
                      opacity: useTransform(activeProgress, [0, 1], [0.5, 1]),
                    }}
                  ></motion.div>

                  {/* Content Card */}
                  <motion.div
                    className={`w-full md:w-5/12 p-4 sm:p-6 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm ml-6 md:ml-0 ${
                      isEven ? "md:mr-8" : "md:ml-8"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      opacity: useTransform(activeProgress, [0, 1], [0.7, 1]),
                    }}
                  >
                    <h3 className="text-white text-lg sm:text-xl font-bold uppercase mb-3">
                      {stage.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      {stage.description}
                    </p>

                    {/* Info Chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {stage.chips.map((chip, chipIndex) => (
                        <div key={chipIndex} className="relative group">
                          <motion.span
                            className="inline-block px-3 py-1 bg-white/10 text-white text-xs rounded-full cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                          >
                            {chip.label}
                          </motion.span>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                            {chip.tooltip}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Commentary */}
                    <motion.p
                      className="text-slate-400 text-xs italic"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{
                        opacity: useTransform(activeProgress, [0, 1], [0, 1]),
                      }}
                    >
                      {stage.commentary}
                    </motion.p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
