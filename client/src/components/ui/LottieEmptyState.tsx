import React from 'react';
import { useLottie } from 'lottie-react';
// Assuming an empty state Lottie file exists
import emptyState from '../../assets/lotties/emptyState.json'; // Placeholder - user needs to provide this file

interface LottieEmptyStateProps {
  message?: string;
  width?: string | number;
  height?: string | number;
}

const LottieEmptyState: React.FC<LottieEmptyStateProps> = ({
  message = "No data to display.",
  width = 200,
  height = 200,
}) => {
  const options = {
    animationData: emptyState,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, { width, height });

  return (
    <div className="flex flex-col items-center justify-center text-gray-500">
      <div style={{ width, height }}>{View}</div>
      <p className="mt-4 text-lg">{message}</p>
    </div>
  );
};

export default LottieEmptyState;