import Game from '@/components/Game';


const letters = [   "M", "I", "O", "N", "H", "B", "K", "P", "G", "D",
                    "L", "E", "C", "H", "S", "R", "A", "T", "U", "I",
                    "G", "R", "O", "E", "Y", "E", "M", "A", "N", "K" ]

const boardSize={width:10, height:10}

export default function Home() {
  return (
    <div className="bg-slate-100 flex items-center justify-center justify-self-center w-full">
      <div className="h-svh w-svw">
        <Game letters={letters} boardSize={boardSize} />        
      </div>
    </div>
  );
}