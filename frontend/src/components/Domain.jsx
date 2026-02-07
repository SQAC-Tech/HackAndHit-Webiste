import React from "react";

const Domain = () => {
  return (
    <section className="flex flex-col items-center px-16 py-28 gap-20 w-full h-[1155.68px] bg-[#041323]">
      <div className="flex flex-row justify-center items-start p-0 gap-12 w-[1280px] h-[450.68px]">
        {/* Cards */}
        <div className="flex flex-col items-start p-0 gap-8 w-[394.67px] h-[423.68px]">
          <div className="w-[394.67px] h-[233.68px] bg-[url('card1.png')] bg-cover"></div>
          <div className="flex flex-col items-center p-0 gap-6 w-[394.67px] h-[158px]">
            <h4 className="w-[394.67px] h-20 text-white text-[40px] font-bold leading-[100%] text-center uppercase tracking-[-0.01em]">
              Domain
            </h4>
            <p className="w-[394.67px] h-[54px] text-white text-[18px] font-normal leading-[150%] text-center">
              Text
            </p>
          </div>
        </div>
        {/* More cards */}
      </div>
      <div className="flex flex-row items-center p-0 gap-6 w-[261px] h-[47px]">
        <button className="flex flex-row justify-center items-center px-6 py-2.5 gap-2 w-[153px] h-[47px] border border-white/20 text-white text-[18px] font-medium leading-[150%]">
          Button
        </button>
        <div className="flex flex-row items-center p-0 gap-2 w-[84px] h-[27px] text-white text-[18px] font-medium leading-[150%]">
          Learn More →
        </div>
      </div>
    </section>
  );
};

export default Domain;
