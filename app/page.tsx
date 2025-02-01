import Game from '@/components/Game';

export default function Home() {
  return (
    <div className="bg-slate-100 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <Game />        
      </div>
    </div>
  );
}