"use client";

import Image from "next/image";

type MicToggleProps = {
  isRecording: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export default function MicToggle({ isRecording, disabled = false, onClick }: MicToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      aria-pressed={isRecording}
      aria-describedby="recording-status"
      className={`relative w-12 h-12 flex justify-center items-center text-white rounded-full transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-wait focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
        isRecording ? "bg-red-600 scale-105" : "bg-blue-500 hover:bg-blue-400"
      }`}
    >
      {isRecording ? (
        <span aria-hidden="true" className="bg-white rounded-sm w-4 h-4" />
      ) : (
        <Image src="/micOn.svg" alt="" width={24} height={24} />
      )}
    </button>
  );
}
