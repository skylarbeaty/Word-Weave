import { ReactNode } from 'react';

interface GameButtonProps {
  children: ReactNode;
  handlePointerDown?: () => void;
}

const GameButton = ({ children, handlePointerDown = () => {} }: GameButtonProps) => {
  return (
    <button className={`bg-indigo-800 text-white
        size-4 xs-box:size-6 sm-box:size-9 md-box:size-12
        rounded-md sm-box:rounded-lg
        p-[2px]   xs-box:p-[4px]    sm-box:p-[6px]    md-box:p-[8px]
        text-[0.3rem] xs-box:text-[0.6rem] sm-box:text-[0.9rem] md-box:text-[1.1rem]`}
        onPointerDown={handlePointerDown}
    >
        {children}
    </button>
  )
}

export default GameButton