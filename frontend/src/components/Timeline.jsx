import React from "react";

const Timeline = () => {
  return (
    <section className="flex flex-col items-center px-16 py-28 gap-20 w-full h-[863px] bg-[#041323]">
      <div className="flex flex-col items-start p-0 gap-20 w-[1280px] max-w-[1280px] h-[639px]">
        <div className="flex flex-row items-start p-0 gap-20 w-[1280px] h-[639px]">
          <div className="flex flex-col items-start p-0 gap-8 w-[600px] h-[179px]">
            <div className="flex flex-col items-start p-0 gap-4 w-[600px] h-[100px]">
              <div className="flex flex-row items-center p-0 w-[67px] h-6">
                <span className="text-white text-[16px] font-semibold leading-[150%]">
                  Tagline
                </span>
              </div>
              <h2 className="w-[600px] h-15 text-white text-[60px] font-bold leading-[100%] uppercase tracking-[-0.01em]">
                Timeline
              </h2>
            </div>
            <div className="flex flex-row items-center p-0 gap-6 w-[228px] h-[47px]">
              <button className="flex flex-row justify-center items-center px-6 py-2.5 gap-2 w-[120px] h-[47px] border border-white/20 text-white text-[18px] font-medium leading-[150%]">
                Button
              </button>
              <div className="flex flex-row items-center p-0 gap-2 w-[84px] h-[27px] text-white text-[18px] font-medium leading-[150%]">
                Learn More →
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start p-0 gap-4 w-[600px] h-[639px]">
            {/* Timeline Items */}
            <div className="flex flex-row items-start p-0 gap-10 w-[600px] h-[164px]">
              <div className="flex flex-col items-center p-0 gap-4 w-12 h-[164px]">
                <div className="w-12 h-12 bg-white rounded-full"></div>
                <div className="w-px h-20 bg-white/20"></div>
              </div>
              <div className="flex flex-col items-start p-0 gap-4 w-[512px] h-[99px]">
                <h6 className="w-[512px] h-[29px] text-white text-[26px] font-bold leading-[110%] uppercase tracking-[-0.01em]">
                  Heading
                </h6>
                <p className="w-[512px] h-[54px] text-white text-[18px] font-normal leading-[150%]">
                  Text
                </p>
              </div>
            </div>
            {/* More timeline items */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
