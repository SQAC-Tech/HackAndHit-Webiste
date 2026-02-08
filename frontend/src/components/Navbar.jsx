import React from "react";

const Navbar = () => {
  const items = [
    { key: "home", name: "Home" },
    { key: "domain", name: "Domains" },
    { key: "timeline", name: "Timeline" },
    { key: "faq", name: "FAQ" },
  ];

  return (
    <nav
      className="
        fixed top-3 left-1/2 -translate-x-1/2
        z-50
        w-[92%] sm:w-[95%] md:w-[80%] lg:w-[40%]
        max-w-4xl
        h-14 sm:h-16 md:h-20
        bg-white/10 backdrop-blur-md
        rounded-3xl border border-white/20
        flex items-center justify-between
        px-4 sm:px-6
      "
    >
      {/* LOGO */}
      <div className="flex items-center gap-2 shrink-0">
        <img
          src="/new-logo.png"
          alt="Hack and Hit Logo"
          className="
            h-7 sm:h-8 md:h-10
            w-auto
            object-contain
          "
        />
      </div>

      {/* NAV LINKS */}
      <ul
        className="
          flex items-center justify-center
          gap-3 sm:gap-6
          text-xs sm:text-sm md:text-lg
          text-white
        "
      >
        {items.map((item) => (
          <li key={item.key}>
            <a
              href={`#${item.key}`}
              className="
                px-2 sm:px-3 md:px-4
                py-1.5 sm:py-2
                rounded-md
                hover:text-orange-400
                hover:bg-white/10
                transition
                whitespace-nowrap
              "
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
