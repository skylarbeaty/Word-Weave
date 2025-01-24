import { useRef, useLayoutEffect } from 'react'
import { useGameContext } from './Game';

interface SpaceProps {
  id: number
}

const Space = ({id}: SpaceProps) => {
  const gameContext = useGameContext()!
  const divRef =  useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gameContext.updateSpace(id, divRef.current)
  })

  return (
    <div className='border-indigo-400 border border-dashed rounded-md w-10 h-10'/>
  )
}

export default Space