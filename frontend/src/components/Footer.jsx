import { FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#020b16] text-gray-300 px-6 sm:px-10 lg:px-20 py-16">
      {/* TOP */}
      <div
        className="
          max-w-7xl mx-auto
          grid grid-cols-1 gap-12
          lg:grid-cols-3 lg:items-center
        "
      >
        {/* BRAND / LOGOS */}
        <div
          className="
            flex flex-col items-center text-center gap-4
            lg:flex-row lg:items-center lg:text-left lg:gap-6
          "
        >
          <img
            src="/Logo.png"
            alt="Hack and Hit Logo"
            className="w-20"
          />
          <img
            src="/new-logo.png"
            alt="Hack and Hit Logo"
            className="w-40"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="text-center lg:text-left">
          <p className="text-base sm:text-lg max-w-md mx-auto lg:mx-0">
            Get the latest updates on Hack and Hit.....
          </p>
        </div>

        {/* NAV + SOCIAL (RIGHT SIDE ON LAPTOP) */}
        <div
          className="
            flex flex-col items-center gap-6
            lg:items-end lg:text-right
          "
        >
          {/* Navigation */}
          <ul className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-base sm:text-lg">
            <li>
              <a href="#home" className="hover:text-blue-400 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#domain" className="hover:text-blue-400 transition">
                Domain
              </a>
            </li>
            <li>
              <a href="#timeline" className="hover:text-blue-400 transition">
                Timeline
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-blue-400 transition">
                FAQ
              </a>
            </li>
          </ul>

          {/* Social */}
          <div className="flex gap-5 text-xl text-white">
            <a
              href="https://www.instagram.com/sqac.srmist?igsh=MTNlMTJmZmtvMW82ag=="
              className="hover:text-blue-400 transition"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/sqacsrm"
              className="hover:text-blue-400 transition"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-[#1f2933] my-10"></div>

      {/* BOTTOM */}
      <div className="text-center text-base sm:text-lg text-gray-400">
        © 2026 Hack and Hit SQAC. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
