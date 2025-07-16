import Image from "next/image";
import React from "react";

interface LoadingScreenProps {
  text?: string;
  fullscreen?: boolean;
  logoSrc?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  text = "Loading...",
  fullscreen = true,
  logoSrc = "/logo.png",
}) => {
  return (
    <div
      className={`
        ${fullscreen ? "fixed inset-0 bg-black/30 z-50" : "py-10"}
        flex items-center justify-center w-full
      `}
    >
      <div className="flex flex-col items-center justify-center animate-pulse space-y-4">
        <Image
          src={logoSrc}
          alt="Loading logo"
          width={180}
          height={60}
          className="mx-auto"
          priority
        />
        {text && (
          <span className="text-base sm:text-lg font-semibold text-textRed text-center">
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
