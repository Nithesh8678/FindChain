import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        group
        relative
        px-8
        py-3
        bg-white/10
        backdrop-blur-sm
         rounded-tr-full rounded-bl-full rounded-br-full
        border
        border-white/20
        hover:bg-white/20
        transition-all
        duration-300
        font-montserrat
        text-white
        flex
        items-center
        gap-3
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <div className="relative z-10 w-5 h-5 left-5 rounded-full bg-white flex items-center group-hover:bg-white/20 transition-all duration-300">
        <svg
          className="w-16 h-16 text-black transform group-hover:translate-x-0.5 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#03672A] to-[#046A29] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    </button>
  );
};

export default Button;
