import Game from '@/components/Game';

export default function Home() {
  return (
    <div className="bg-slate-100 flex items-center justify-center justify-self-center w-full">
      <div className="h-[window.innerHeight] h-[window.innerHeight]">
        <Game />        
      </div>
    </div>
  );
}