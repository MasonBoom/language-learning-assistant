import React, { useState } from 'react';
import Image from 'next/image';

const MicToggle: React.FC = () => {
  const [isMicOn, setIsMicOn] = useState(false);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  return (
    <div>
      <input
        type="checkbox"
        id="checkbox"
        className="hidden"
        checked={isMicOn}
        onChange={toggleMic}
      />
      <label
        htmlFor="checkbox"
        className={`relative w-12 h-12 flex justify-center items-center bg-blue-500 text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
          isMicOn ? 'bg-red-600 scale-105' : 'hover:bg-blue-400'
        }`}
      >
        <div className={`${isMicOn ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ease-in-out absolute inset-0 flex justify-center items-center`}>
          <Image src="/micOn.svg" alt="Mic Off" width={24} height={24} />
        </div>
        <div className={`${isMicOn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ease-in-out absolute inset-0 flex justify-center items-center`}>
          <div className="bg-black rounded-full w-4 h-4"></div>
        </div>
      </label>
    </div>
  );
};

export default MicToggle;
