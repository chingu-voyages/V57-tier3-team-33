import React from "react";
import { useLottie } from "lottie-react";
import handLoading from "../../assets/lotties/handLoading.json"; // Adjust path as needed

interface LottieLoaderProps {
  width?: string | number;
  height?: string | number;
}

const LottieLoader: React.FC<LottieLoaderProps> = ({
  width = 300,
  height = 300,
}) => {
  const options = {
    animationData: handLoading,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, { width, height });

  return <div style={{ width, height }}>{View}</div>;
};

export default LottieLoader;
