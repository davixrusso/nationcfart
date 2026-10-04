import React from 'react';
import { useGame } from '../context/GameContext';
import { ArrowRight, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PassTurnView() {
  const { state, dispatch } = useGame();
  const { players } = useGame().state;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 max-w-md mx-auto text-center space-y-6 pt-12"
    >
      <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-2 ring-8 ring-primary/10">
        <EyeOff className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">
          1ª Rodada Concluída!
        </span>
        <h2 className="text-3xl font-extrabold">Fim da vez de {players.p1.name}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          As escolhas foram guardadas em segredo. Passe o celular/computador para <b>{players.p2.name}</b> para iniciar a 2ª rodada!
        </p>
      </div>

      <div className="glass p-5 rounded-3xl space-y-3 text-left">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{players.p2.avatar}</div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Próximo a jogar</p>
            <p className="text-lg font-bold">{players.p2.name}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => dispatch({ type: 'START_P2_ROUND' })}
        className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 tap-target shadow-lg shadow-primary/30 active:scale-95 transition-transform"
      >
        Começar Rodada de {players.p2.name}
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
