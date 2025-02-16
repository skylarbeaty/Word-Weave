import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-slate-100 h-svh w-svw">
      <div className="justify-self-center max-w-[600px] p-2">
        <h1 className={`font-bold text-center mb-2
                        text-lg xs-box:text-xl sm-box:text-2xl md-box:text-3xl`}>
          Word Weave
        </h1><br></br>
        <h1 className={`font-bold text-center mb-2
                        text-sm xs-box:text-base sm-box:text-lg md-box:text-xl`}>
          Welcome to the closed alpha
        </h1><br></br>
        <p>
          Word Weave is the anagram finding daily puzzle game. Each day there is a new set of lettered tiles. Your job is to weave a pattern of words together on the board. 
        </p><br></br>
        <p>
          There are only so many letters so make sure you reuse them to get more score out of the same tiles. 
        </p><br></br>
        <p>
          Try to use all the tiles. There's always a way to use them all, and usually there are many ways. 
        </p>
        
        <div className="justify-self-center mt-2">
          <Link href={"/daily"}>
            <button className={`bg-emerald-800 text-white justify-self-center
            active:bg-emerald-600 hover:bg-emerald-700
            rounded-md sm-box:rounded-lg
            text-sm xs-box:text-base sm-box:text-lg md-box:text-xl
            p-[4px]   xs-box:p-[8px]    sm-box:p-[10px]    md-box:p-[10px]
            `}>
              Play Daily Puzzle
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}