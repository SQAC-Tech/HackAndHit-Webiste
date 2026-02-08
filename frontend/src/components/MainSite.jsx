import React from "react";
import Navbar from "./Navbar";
import Hero from "./hero";
import Timeline from "./Timeline";
import Domain from "./Domain";
import FAQ from "./FAQ";
import Footer from "./Footer";


const MainSite = () => {
  return (
    <div className="flex flex-col min-h-screen scroll-smooth overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* HOME */}
      <section
        id="home"
        className="scroll-mt-24"
      >
        <Hero />
      </section>

      {/* DOMAINS */}
      <section
        id="domain"
        className="scroll-mt-24"
      >
        <Domain />
      </section>

      {/* TIMELINE */}
      <section
        id="timeline"
        className="scroll-mt-24"
      >
        <Timeline />
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="scroll-mt-24"
      >
        <FAQ />
      </section>

      <Footer/>

    </div>
  );
};

export default MainSite;
