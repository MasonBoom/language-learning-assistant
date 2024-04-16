import React, { FC } from "react";
import "@/styles/animatedInput.css"

interface AnimatedInputProps {
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelSpans: string[];
}

export const AnimatedInput: FC<AnimatedInputProps> = ({ type, name, value, onChange, labelSpans }) => {
  return (
    <div className="form-control relative my-5"> 
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="block w-full bg-transparent border-0 border-b-2 border-blue-500 pt-3 pb-1 pl-1 text-lg text-blue-500 focus:outline-none focus:border-blue-600"
      />
      <label className="absolute top-4 left-0 pointer-events-none">
        {labelSpans.map((span, index) => (
          <span key={index} className="inline-block text-lg min-w-[5px] text-blue-500" style={{ transitionDelay: `${index * 50}ms` }}>{span}</span>
        ))}
      </label>
    </div>
  );
};