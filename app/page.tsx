import Link from 'next/link'

export default function Home() {
  return (
    <div className="h-svh w-svw mt-4">
      <div className="justify-self-center max-w-[600px] p-2">
        <h1 className={`font-bold text-center mb-2
                        text-lg xs-box:text-xl sm-box:text-2xl md-box:text-3xl`}>
          Word Weave
        </h1><br></br>
        <p>
          Word Weave is the anagram finding daily puzzle game. Each day there is a new set of lettered tiles. Your job is to weave a pattern of words together on the board. 
        </p><br></br>
        <p>
          There are only so many letters so make sure you reuse them to get more score out of the same tiles. 
        </p><br></br>
        <p>
          Try to use all the tiles. There's always a way to use them all, and usually there are many ways. 
        </p><br></br>
        <h1 className={`font-bold text-center mb-2
                        text-base xs-box:text-base sm-box:text-lg md-box:text-xl`}>
          Welcome to the alpha
        </h1>
        <p className='text-center italic'>
          Note: only Chromium based browsers are currently supported
        </p><br></br>
        <div className="justify-self-center mt-2">
          <Link href={"/daily"}>
            <button className={`text-white justify-self-center
            bg-indigo-800 active:bg-indigo-500 hover:bg-indigo-700
            rounded-md sm-box:rounded-lg
            text-base xs-box:text-base sm-box:text-lg md-box:text-xl
            p-[6px]   xs-box:p-[8px]    sm-box:p-[10px]    md-box:p-[10px]
            `}>
              Play Daily Puzzle
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}