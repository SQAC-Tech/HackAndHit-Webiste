import React from "react";

const FAQ = () => {
  return (
    <section className="bg-gradient-to-b from-slate-950 to-[#020b16] text-white px-6 sm:px-10 lg:px-24 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
          QUESTIONS
        </h1>

        <p className="text-slate-300 text-sm sm:text-base mb-12 sm:mb-16 max-w-xl">
          Everything you need to know about the event
        </p>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-20">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Who can participate?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Only SRM B.Tech students from 1st year, 2nd year, and 3rd year are
              eligible to participate in this event.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              What is the team size and registration fee?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Each team must have 2 to 4 members. The registration fee is ₹150
              per team.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Is there any screening or elimination round?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Yes, a PPT round will be conducted for screening and elimination.
              This round will be held in online mode.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Will participants receive certificates?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Yes, all participants will receive a participation certificate,
              even if they are not selected or do not win.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              When and where is the event happening?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              The event will take place on 13th and 14th February at TP401–402
              rooms.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="border-t border-slate-700 pt-10">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            Contact Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold">Priyanshu Vasudev</h3>
              <p className="text-slate-400 text-sm mb-1">
                Secretary of SQAC
              </p>
              <p className="text-blue-400 text-sm">
                +91 98728 54883
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Jay Jariwala</h3>
              <p className="text-slate-400 text-sm mb-1">
                Joint Secretary of SQAC
              </p>
              <p className="text-blue-400 text-sm">
                +91 80078 03184
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Javin Trivedi</h3>
              <p className="text-slate-400 text-sm mb-1">
                Corporate Lead of SQAC
              </p>
              <p className="text-blue-400 text-sm">
                +91 82095 97013
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
