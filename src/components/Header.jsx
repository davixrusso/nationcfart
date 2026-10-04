import React from 'react';
import { useGame } from '../context/GameContext';
import { Globe2, RotateCcw } from 'lucide-react';

export default function Header() {
  const { dispatch } = useGame();

  return (
    <header className="flex items-center justify-between p-4 glass sticky top-0 z-50 rounded-b-2xl mb-4 mx-2">
      <div className="flex items-center gap-2">
        <Globe2 className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          NationCraft
        </h1>
      </div>
      <button
        onClick={() => dispatch({ type: 'RESTART_GAME' })}
        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors tap-target flex items-center justify-center"
        title="Reiniciar Jogo"
      >
        <RotateCcw className="w-6 h-6" />
      </button>
    </header>
  );
}
