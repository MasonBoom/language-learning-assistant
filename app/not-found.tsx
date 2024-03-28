import React from "react";
import "@/styles/custom404.css";

const Custom404: React.FC = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center mt-[5em]">
        <div className="antenna w-20 h-20 rounded-full border-2 border-black bg-blue-500 mb-[-6em] z-[-1]">
          <div className="antenna_shadow absolute bg-transparent w-[50px] h-[56px] ml-[1.68em] rounded-[45%] rotate-[140deg] border-4 border-transparent" />
          <div className="a1 relative -top-[102%] -left-[130%] w-[12em] h-[5.5em] rounded-[50px] rotate-[-29deg]" />
          <div className="a1d relative rotate-45 rounded-full border-2 border-black" />
          <div className="a2 relative -top-[210%] -left-[10%] w-[12em] h-[4em] rounded-[50px] mr-[5em] rotate-[-8deg]" />
          <div className="relative rounded-full border-2 border-black z-50 [top:-294%] [left:94%] [width:0.5em] [height:0.5em] [background-color:#979797]" />
          <div className="a_base" />
        </div>
        <div className="w-[17em] h-[9em] mt-[3em] rounded-[15px] bg-blue-500 flex justify-center border-2 border-[#1d0e01] shadow-[inset_0.2em_0.2em_#3B82F6]">
          <div className="display_div flex items-center self-center justify-center rounded-lg">
            <div className="w-auto h-auto rounded-lg">
              <div className="w-[11em] h-[7.75em] flex items-center justify-center rounded-lg">
                <div className="screen w-[13em] h-[7.85em] border-2 border-[#1d0e01] rounded-lg z-50 flex items-center justify-center font-bold tracking-wider text-center">
                  <span className="bg-black px-[0.3em] text-[0.75em] text-white rounded-[5px] z-10">
                    NOT FOUND
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="lines flex self-end">
            <div className="line1 h-2 bg-black mt-2 w-[2px]" />
            <div className="line2 flex-grow bg-black w-[2px] h-[1em]" />
            <div className="line3 h-2 bg-black mt-2" />
          </div>
          <div className="w-[4.25em] self-center h-[8em] bg-blue-400 border-2 border-[#1d0e01] p-[0.6em] rounded-[10px] flex items-center justify-center flex-col gap-[0.75em] shadow-[3px_3px_0px_#3B82F6]">
            <div className="b1 rounded-full border-2 border-black [width:1.65em] [height:1.65em] bg-blue-500">
              <div />
            </div>
            <div className="b2 rounded-full border-2 border-black bg-blue-500" />
            <div className="speakers flex flex-col">
              <div className="g1 flex">
                <div className="g11 bg-blue-500" />
                <div className="g12 bg-blue-500" />
                <div className="g13 bg-blue-500" />
              </div>
              <div className="g" />
              <div className="g" />
            </div>
          </div>
        </div>
        <div className="bottom w-full flex items-center justify-center custom-gap">
          <div className="base1 h-4 w-8 bg-gray-700 border-2 border-black" />
          <div className="base2 h-4 w-8 bg-gray-700 border-2 border-black" />
          <div className="base3 absolute bg-black" />
        </div>
      </div>
      <div className="text_404">
        <div className="text_4041">4</div>
        <div className="text_4042">0</div>
        <div className="text_4043">4</div>
      </div>
    </div>
  );
};

export default Custom404;
