import { ReactNode } from 'react'

interface GameButtonProps {
  children: ReactNode
  handlePointerDown?: () => void
  disabled?: boolean
}

const GameButton = ({ children, handlePointerDown = () => {}, disabled = false }: GameButtonProps) => {
  return (
    <button disabled={disabled} className={`bg-indigo-800 text-white
        disabled:bg-slate-400 active:bg-indigo-500 hover:bg-indigo-700
        size-4 xs-box:size-6 sm-box:size-9 md-box:size-11
        rounded-md sm-box:rounded-lg
        p-[2px]   xs-box:p-[4px]    sm-box:p-[6px]    md-box:p-[8px]`}
        onPointerDown={disabled ? undefined : handlePointerDown}
    >
        {children}
    </button>
  )
}

export default GameButton