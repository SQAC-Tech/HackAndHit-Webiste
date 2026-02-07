import React from "react";

const FAQ = () => {
  return (
    <section className="flex flex-col items-center px-16 py-28 gap-20 w-full h-[1054px] bg-[#041323]">
      <div className="flex flex-col items-start p-0 gap-20 w-[1280px] max-w-[1280px] h-[830px]">
        <div className="flex flex-col items-start p-0 gap-6 w-[768px] max-w-[768px] h-[114px]">
          <h2 className="w-[768px] h-15 text-white text-[60px] font-bold leading-[100%] uppercase tracking-[-0.01em]">
            Questions
          </h2>
          <p className="w-[768px] h-[30px] text-white text-[20px] font-normal leading-[150%]">
            Text
          </p>
        </div>
        <div className="flex flex-col items-start p-0 gap-16 w-[1280px] h-[399px]">
          {/* FAQ Items */}
          <div className="flex flex-row items-start p-0 gap-12 w-[1280px] h-[181px]">
            <div className="flex flex-col items-start p-0 gap-4 w-[394.67px] h-[154px]">
              <h5 className="w-[394.67px] h-[30px] text-white text-[20px] font-bold leading-[150%]">
                Question
              </h5>
              <p className="w-[394.67px] h-[108px] text-white text-[18px] font-normal leading-[150%]">
                Answer
              </p>
            </div>
            {/* More FAQ items */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
