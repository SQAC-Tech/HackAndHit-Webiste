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
        fixed top-3 left-45 -translate-x-1/2 overflow-x-hidden
        z-50
        w-[35%] lg:w-[95%] md:w-[50%] md:left-1/2 lg:left-1/2 max-w-4xl
        h-14 sm:h-16 md:h-20
        bg-white/10 backdrop-blur-md
        rounded-xl border border-white/20
        flex items-center justify-center
      "
    >
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
