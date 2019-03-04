import React, { useState, useEffect } from "react";
import { start } from "repl";

interface Props {
  children: React.ReactElement;
  onHoldDuration?: number;
  onHold: () => void;
  onClick: () => void;
  style: React.CSSProperties;
}

const ClickContainer: React.SFC<Props> = ({
  children,
  onHoldDuration = 300,
  onHold,
  onClick,
  style
}) => {
  const [startingTime, setStartingTime] = useState(Date.now());
  const [timer, setTimer] = useState<NodeJS.Timer>();

  const handlePress = (args: any) => {
    setStartingTime(Date.now());
    setTimer(setTimeout(onHold, onHoldDuration));
  };

  const handleRelease = (args: any) => {
    clearTimeout(timer!);
    if (Date.now() - startingTime < onHoldDuration) onClick();
  };

  const handleCancel = (args: any) => {
    clearTimeout(timer!);
  };

  return (
    <div
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleCancel}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      style={style}
    >
      {children}
    </div>
  );
};

export default ClickContainer;
