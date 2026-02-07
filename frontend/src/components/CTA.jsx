import React from "react";

const CTA = () => {
  return (
    <section className="flex flex-col items-center px-16 py-28 gap-20 w-full h-[605px] bg-[#041323]">
      <div className="flex flex-col items-start p-0 gap-20 w-[1280px] max-w-[1280px] h-[381px]">
        <div className="flex flex-row items-center px-16 py-0 w-[1280px] h-[381px] bg-[url('cta-bg.png')] bg-cover bg-center border border-white/20 relative">
          <div className="flex flex-col items-start p-0 gap-8 w-[768px] max-w-[768px] h-[253px]">
            <div className="flex flex-col items-start p-0 gap-6 w-[768px] h-[174px]">
              <h2 className="w-[768px] h-30 text-white text-[60px] font-bold leading-[100%] uppercase tracking-[-0.01em]">
                Heading
              </h2>
              <p className="w-[768px] h-[30px] text-white text-[20px] font-normal leading-[150%]">
                Text
              </p>
            </div>
            <div className="flex flex-row items-start p-0 gap-4 w-[282px] h-[47px]">
              <button className="flex flex-row justify-center items-center px-6 py-2.5 gap-2 w-[120px] h-[47px] bg-[#FF6B35] border border-[#FF6B35] text-white text-[18px] font-medium leading-[150%]">
                Button
              </button>
              <button className="flex flex-row justify-center items-center px-6 py-2.5 gap-2 w-[146px] h-[47px] border border-white/20 text-white text-[18px] font-medium leading-[150%]">
                Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
