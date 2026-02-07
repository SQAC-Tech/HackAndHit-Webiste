import React from "react";
import Navbar from "./Navbar";
import Hero from "./hero";
import Timeline from "./Timeline";
import Domain from "./Domain";
import FAQ from "./FAQ";
import CTA from "./CTA";
import Footer from "./Footer";

const MainSite = () => {
  return (
    <>
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <Domain />
      <Timeline />
      <FAQ />
      <CTA />
      <Footer />
    </div>
    </>
  );
};

export default MainSite;
