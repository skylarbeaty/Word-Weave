import { forwardRef } from 'react'
import { TlsOptions } from 'tls'

interface TileProps {
  id: number
  letter: string
}
// forwardRef<HTMLDivElement, TileProps>(({ id, letter }, ref)
const Tile = forwardRef<HTMLDivElement, TileProps>((props, ref) => {
  return (
    <div className='draggable w-10 h-10 flex fixed items-center justify-center rounded bg-indigo-600 text-white drop-shadow-md'
      ref={ref}
    >
      {props.letter}
    </div>
  )
})

export default Tile