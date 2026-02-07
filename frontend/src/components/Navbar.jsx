import React from "react";

const Navbar = () => {
  return (
    <nav className="flex flex-col items-center p-0 w-full h-[100px] bg-[#082746]">
      <div className="flex flex-row justify-between items-center p-0 gap-[622px] mx-auto w-[1312px] h-[43px] mt-[27px]">
        <div className="flex flex-row items-center p-0 gap-6 w-[426px] h-[36px]">
          {/* Logo Placeholder */}
          <div className="w-[84px] h-[36px] bg-white relative">
            {/* Logo Vectors - simplified */}
            <div className="absolute inset-0 flex items-center justify-center text-black font-bold">
              LOGO
            </div>
          </div>
          <div className="flex flex-row items-center p-0 gap-8 w-[318px] h-[27px]">
            <a
              href="#"
              className="text-white text-[18px] font-normal leading-[150%]"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white text-[18px] font-normal leading-[150%]"
            >
              About
            </a>
            <a
              href="#"
              className="text-white text-[18px] font-normal leading-[150%]"
            >
              Team
            </a>
            <div className="flex flex-row items-center p-0 gap-1 w-[72px] h-[27px]">
              <a
                href="#"
                className="text-white text-[18px] font-normal leading-[150%]"
              >
                More
              </a>
              <div className="w-6 h-6 text-white">▼</div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center p-0 gap-4 w-[112px] h-[43px]">
          <button className="flex flex-row justify-center items-center px-5 py-2 gap-2 w-[112px] h-[43px] bg-[#FF6B35] border border-[#FF6B35] text-white text-[18px] font-medium leading-[150%]">
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
