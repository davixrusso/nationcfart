import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Users, Bot, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const AVATARS = ['😎', '🤓', '🤠', '🤖', '👽', '👻', '🦊', '🦖'];

export default function ModeSelect() {
  const { dispatch } = useGame();
  const [mode, setMode] = useState('1v1');
  const [difficulty, setDifficulty] = useState('medium');
  const [totalRounds, setTotalRounds] = useState(5);
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [p1Avatar, setP1Avatar] = useState('😎');
  const [p2Avatar, setP2Avatar] = useState('🤓');

  const startGame = () => {
    dispatch({
      type: 'START_GAME',
      payload: {
        mode,
        difficulty,
        totalRounds,
        p1Name: p1Name || 'Jogador 1',
        p2Name: p2Name || (mode === 'bot' ? 'IA Bot' : 'Jogador 2'),
        p1Avatar,
        p2Avatar: mode === 'bot' ? '🤖' : p2Avatar,
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 max-w-md mx-auto space-y-6 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Modo de Jogo</h2>
        <p className="text-gray-500 dark:text-gray-400">Monte seus países e vença a disputa!</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setMode('1v1')} className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${mode === '1v1' ? 'border-primary bg-primary/10' : 'border-transparent glass'}`}>
          <Users className="w-10 h-10" />
          <span className="font-semibold">Local 1v1</span>
        </button>
        <button onClick={() => setMode('bot')} className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${mode === 'bot' ? 'border-primary bg-primary/10' : 'border-transparent glass'}`}>
          <Bot className="w-10 h-10" />
          <span className="font-semibold">vs IA</span>
        </button>
      </div>

      {mode === 'bot' && (
        <div className="glass p-4 rounded-2xl">
          <label className="block text-sm font-medium mb-2">Dificuldade da IA</label>
          <div className="flex gap-2">
            {['easy', 'medium', 'hard'].map(d => (
              <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-2 rounded-xl transition-colors capitalize ${difficulty === d ? 'bg-primary text-white font-bold' : 'bg-gray-100 dark:bg-gray-800'}`}>
                {d === 'easy' ? 'Fácil' : d === 'medium' ? 'Médio' : 'Difícil'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 glass p-4 rounded-2xl">
        <div>
          <label className="block text-sm font-medium mb-1">Jogador 1</label>
          <div className="flex gap-2 mb-2 overflow-x-auto custom-scrollbar pb-2">
            {AVATARS.map(a => (
              <button key={a} onClick={() => setP1Avatar(a)} className={`text-2xl p-2 rounded-full min-w-[48px] min-h-[48px] ${p1Avatar === a ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>{a}</button>
            ))}
          </div>
          <input type="text" value={p1Name} onChange={e => setP1Name(e.target.value)} className="w-full p-3 rounded-xl border bg-transparent focus:border-primary outline-none min-h-[48px]" placeholder="Nome do Jogador 1..." />
        </div>
        
        {mode === '1v1' && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <label className="block text-sm font-medium mb-1">Jogador 2</label>
            <div className="flex gap-2 mb-2 overflow-x-auto custom-scrollbar pb-2">
              {AVATARS.map(a => (
                <button key={a} onClick={() => setP2Avatar(a)} className={`text-2xl p-2 rounded-full min-w-[48px] min-h-[48px] ${p2Avatar === a ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>{a}</button>
              ))}
            </div>
            <input type="text" value={p2Name} onChange={e => setP2Name(e.target.value)} className="w-full p-3 rounded-xl border bg-transparent focus:border-primary outline-none min-h-[48px]" placeholder="Nome do Jogador 2..." />
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <label className="block text-sm font-medium mb-2">Quantidade de Rodadas / Categorias</label>
          <div className="flex gap-2">
            {[5, 10, 19].map(t => (
              <button key={t} onClick={() => setTotalRounds(t)} className={`flex-1 py-2 rounded-xl min-h-[48px] transition-colors ${totalRounds === t ? 'bg-primary text-white font-bold' : 'bg-gray-100 dark:bg-gray-800'}`}>
                {t} Rodadas
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={startGame} className="w-full min-h-[48px] py-4 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 tap-target shadow-lg shadow-primary/30 active:scale-95 transition-transform">
        <Play className="w-6 h-6 fill-current" />
        INICIAR PARTIDA
      </button>
    </motion.div>
  );
}
