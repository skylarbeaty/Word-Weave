import Game from '@/components/Game';

const letters = [   "S", "M", "T", "N", "N", "O", "R", "E", "G", "U",
                    "C", "I", "L", "V", "D", "N", "T", "A", "S", "R",
                    "E", "N", "G", "I", "C", "O", "A", "T", "A", "L" ]

const boardSize={width:10, height:14}

export default function Home() {
  return (
    <div className="bg-slate-100 flex items-center justify-center justify-self-center w-full">
      <div className="h-svh w-svw">
        <Game letters={letters} boardSize={boardSize} />        
      </div>
    </div>
  );
}