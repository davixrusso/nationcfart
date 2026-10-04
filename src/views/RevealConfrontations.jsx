import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { countryData } from '../data/countryData';
import { Swords, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function RevealConfrontations() {
  const { state, dispatch } = useGame();
  const { selectedCategories, players, revealIndex, totalRounds } = state;
  const currentCategory = selectedCategories[revealIndex];

  const p1ChoiceId = players.p1.choices[currentCategory?.id];
  const p2ChoiceId = players.p2.choices[currentCategory?.id];

  const p1Country = countryData.find(c => c.id === p1ChoiceId);
  const p2Country = countryData.find(c => c.id === p2ChoiceId);

  const [revealed, setRevealed] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    setRevealed(false);
    setWinner(null);

    const timer = setTimeout(() => {
      if (!p1Country || !p2Country || !currentCategory) return;
      const p1Score = p1Country.stats[currentCategory.id]?.score || 0;
      const p2Score = p2Country.stats[currentCategory.id]?.score || 0;

      let roundWin = 'draw';
      if (p1Score > p2Score) roundWin = 'p1';
      else if (p2Score > p1Score) roundWin = 'p2';

      setWinner(roundWin);
      setRevealed(true);

      if (roundWin !== 'draw') {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [revealIndex, currentCategory?.id]);

  const handleNextReveal = () => {
    // Atualizar pontuação acumulada até o momento
    const p1Score = p1Country.stats[currentCategory.id]?.score || 0;
    const p2Score = p2Country.stats[currentCategory.id]?.score || 0;
    
    let addP1 = p1Score > p2Score ? 1 : 0;
    let addP2 = p2Score > p1Score ? 1 : 0;

    dispatch({
      type: 'SET_REVEAL_SCORES',
      payload: {
        p1Score: players.p1.score + addP1,
        p2Score: players.p2.score + addP2
      }
    });

    if (revealIndex + 1 >= totalRounds) {
      dispatch({ type: 'FINISH_GAME' });
    } else {
      dispatch({ type: 'NEXT_REVEAL' });
    }
  };

  if (!currentCategory || !p1Country || !p2Country) return null;

  const p1Stat = p1Country.stats[currentCategory.id];
  const p2Stat = p2Country.stats[currentCategory.id];

  return (
    <div className="p-4 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[75vh]">
      {/* Placar em Tempo Real */}
      <div className="flex items-center gap-6 glass px-6 py-2 rounded-full mb-6 text-sm font-bold">
        <span className="text-blue-500">{players.p1.name}: {players.p1.score} pts</span>
        <span className="text-gray-400">vs</span>
        <span className="text-red-500">{players.p2.name}: {players.p2.score} pts</span>
      </div>

      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          Confronto {revealIndex + 1} de {totalRounds}
        </span>
        <h2 className="text-3xl font-black">{currentCategory.name}</h2>
        <p className="text-gray-500 text-sm">Revelação da escolha dos dois jogadores</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
        {/* P1 Card */}
        <motion.div 
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`flex-1 glass p-6 rounded-3xl text-center w-full max-w-sm transition-all duration-500 ${
            revealed && winner === 'p1' ? 'ring-4 ring-green-500 bg-green-500/10 scale-105' : ''
          } ${revealed && winner === 'p2' ? 'opacity-50 grayscale' : ''}`}
        >
          <div className="mb-3">
            <span className="text-2xl">{players.p1.avatar}</span>
            <p className="font-bold text-sm text-gray-500">{players.p1.name}</p>
          </div>
          <div className="text-6xl mb-3">{p1Country.flag}</div>
          <h3 className="text-2xl font-bold mb-4">{p1Country.name}</h3>
          
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: revealed ? `${p1Stat?.score || 0}%` : '0%' }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-blue-500"
            />
          </div>
          <div className="mt-2 font-mono font-bold text-lg h-7">
            {revealed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {p1Stat?.display} ({p1Stat?.score} pts)
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* VS Badge */}
        <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/30 z-10 -my-3 md:my-0 md:-mx-3">
          <Swords className="w-7 h-7" />
        </div>

        {/* P2 Card */}
        <motion.div 
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`flex-1 glass p-6 rounded-3xl text-center w-full max-w-sm transition-all duration-500 ${
            revealed && winner === 'p2' ? 'ring-4 ring-green-500 bg-green-500/10 scale-105' : ''
          } ${revealed && winner === 'p1' ? 'opacity-50 grayscale' : ''}`}
        >
          <div className="mb-3">
            <span className="text-2xl">{players.p2.avatar}</span>
            <p className="font-bold text-sm text-gray-500">{players.p2.name}</p>
          </div>
          <div className="text-6xl mb-3">{p2Country.flag}</div>
          <h3 className="text-2xl font-bold mb-4">{p2Country.name}</h3>
          
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: revealed ? `${p2Stat?.score || 0}%` : '0%' }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-red-500"
            />
          </div>
          <div className="mt-2 font-mono font-bold text-lg h-7">
            {revealed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {p2Stat?.display} ({p2Stat?.score} pts)
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>

      {revealed && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center w-full max-w-md"
        >
          <div className="mb-5">
            <h3 className="text-2xl font-extrabold text-green-500 dark:text-green-400">
              {winner === 'draw' ? 'Empate nesta categoria!' : `${players[winner].name} Pontuou! 🎯`}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {winner === 'p1' ? `${p1Country.name} superou ${p2Country.name}` : winner === 'p2' ? `${p2Country.name} superou ${p1Country.name}` : 'Mesmo valor técnico atingido'}
            </p>
          </div>

          <button
            onClick={handleNextReveal}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 tap-target shadow-lg shadow-primary/30 active:scale-95 transition-transform"
          >
            {revealIndex + 1 >= totalRounds ? 'Ver Resultado Final' : 'Próximo Confronto'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
