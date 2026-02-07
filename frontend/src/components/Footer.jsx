import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center px-20 py-20 gap-20 w-full h-[544px] bg-[#041323]">
      <div className="flex flex-col items-start p-0 gap-20 w-[1280px] max-w-[1280px] h-[384px]">
        <div className="flex flex-row items-start p-0 gap-32 w-[1280px] h-[248px]">
          <div className="flex flex-col items-start p-0 gap-6 w-[500px] h-[215px]">
            <div className="w-[84px] h-[36px] bg-white relative">
              <div className="absolute inset-0 flex items-center justify-center text-black font-bold">
                LOGO
              </div>
            </div>
            <p className="w-[500px] h-[54px] text-white text-[18px] font-normal leading-[150%]">
              Get the latest updates on Hack and Hit events and announcements.
            </p>
            <div className="flex flex-col items-start p-0 gap-3 w-[500px] h-[77px]">
              <div className="flex flex-row items-start p-0 gap-4 w-[500px] h-[47px]">
                <input
                  className="flex items-center px-3 py-2 gap-2 w-[349px] h-[43px] bg-white/10 border border-white/20 text-white placeholder-white/60"
                  placeholder="Email"
                />
                <button className="flex flex-row justify-center items-center px-6 py-2.5 gap-2 w-[135px] h-[47px] border border-white/20 text-white text-[18px] font-medium leading-[150%]">
                  Subscribe
                </button>
              </div>
              <p className="w-[500px] h-[18px] text-white text-[12px] font-normal leading-[150%]">
                By subscribing you agree to our Privacy Policy and consent to
                receive updates.
              </p>
            </div>
          </div>
          <div className="flex flex-row items-start p-0 gap-10 w-[652px] h-[243px]">
            {/* Links */}
            <div className="flex flex-col items-start p-0 gap-4 w-[190.67px] h-[243px]">
              <div className="w-[190.67px] h-[27px] text-white text-[18px] font-semibold leading-[150%]">
                Navigation
              </div>
              <div className="flex flex-col items-start p-0 w-[190.67px] h-[200px]">
                <a
                  href="#"
                  className="py-2 text-white text-[16px] font-normal leading-[150%]"
                >
                  Home
                </a>
                {/* More links */}
              </div>
            </div>
            {/* More columns */}
          </div>
        </div>
        <div className="flex flex-col items-start p-0 gap-8 w-[1280px] h-[56px]">
          <div className="w-[1280px] h-px border-t border-white/20"></div>
          <div className="flex flex-row justify-between items-start p-0 gap-16 w-[1280px] h-6">
            <p className="mx-auto text-white text-[16px] font-normal leading-[150%]">
              © 2026 Hack and Hit. All rights reserved.
            </p>
            <div className="flex flex-row items-start p-0 gap-6 mx-auto w-[405px] h-6">
              <a
                href="#"
                className="text-white text-[16px] font-normal leading-[150%] underline"
              >
                Privacy Policy
              </a>
              {/* More links */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
