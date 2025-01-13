import Game from '@/components/Game';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-900">Word Weave</h1>
        <Game />        
      </div>
    </div>
  );
}