import BoardSpace from './BoardSpace';

const Board = () => {
  return (
    <div id="board" className="grid grid-cols-10 gap-2 p-4">
      {Array.from({ length: 140 }).map((_, index) => (
        <BoardSpace key={index} index={index} />
      ))}
    </div>
  )
}

export default Board