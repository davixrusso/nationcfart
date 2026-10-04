import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { countryData } from '../data/countryData';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Swords, ArrowRight, Info } from 'lucide-react';

export default function BattleResult() {
  const { state, dispatch } = useGame();
  const { currentDraft, players } = state;
  const category = currentDraft.category;
  
  const p1Country = countryData.find(c => c.id === currentDraft.p1Choice);
  const p2Country = countryData.find(c => c.id === currentDraft.p2Choice);

  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    // Calcular vencedor após pequena pausa para suspense
    const timer = setTimeout(() => {
      const p1Score = p1Country.stats[category.id].score;
      const p2Score = p2Country.stats[category.id].score;
      
      let res = 'draw';
      if (p1Score > p2Score) res = 'p1';
      else if (p2Score > p1Score) res = 'p2';

      setWinner(res);
      setShowResult(true);

      if (res !== 'draw') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#fbbf24']
        });
      }

      // Dispatch para atualizar score history
      dispatch({
        type: 'RESOLVE_BATTLE',
        payload: { winner: res }
      });
      
    }, 2000);

    return () => clearTimeout(timer);
  }, [p1Country, p2Country, category.id, dispatch]);

  const handleNext = () => {
    dispatch({ type: 'NEXT_TURN' });
  };

  const getWinnerMessage = () => {
    if (winner === 'draw') return 'Empate!';
    const winnerName = players[winner].name;
    const winnerCountry = winner === 'p1' ? p1Country : p2Country;
    return `${winnerName} venceu com ${winnerCountry.name}!`;
  };

  const getJustification = () => {
    if (winner === 'draw') return `Ambos os países tiveram a mesma pontuação em ${category.name}.`;
    const winnerCountry = winner === 'p1' ? p1Country : p2Country;
    const loserCountry = winner === 'p1' ? p2Country : p1Country;
    return `${winnerCountry.name} superou ${loserCountry.name} devido ao seu melhor desempenho histórico e estatístico no quesito ${category.name}.`;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{category.name}</h2>
        <p className="text-gray-500">Resultados da Batalha</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
        {/* P1 Card */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`flex-1 glass p-6 rounded-3xl text-center w-full max-w-sm ${showResult && winner === 'p1' ? 'ring-4 ring-green-500' : ''} ${showResult && winner === 'p2' ? 'opacity-50 grayscale' : ''}`}
        >
          <div className="mb-4">
            <span className="text-xl">{players.p1.avatar}</span>
            <p className="font-bold">{players.p1.name}</p>
          </div>
          <div className="text-6xl mb-4">{p1Country.flag}</div>
          <h3 className="text-2xl font-bold mb-4">{p1Country.name}</h3>
          
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: showResult ? `${p1Country.stats[category.id].score}%` : '0%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-blue-500"
            />
          </div>
          <div className="mt-2 font-mono font-bold text-xl h-8">
            {showResult && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {p1Country.stats[category.id].display}
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* VS Badge */}
        <div className="flex items-center justify-center z-10 -my-4 md:my-0 md:-mx-4">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/30">
            <Swords className="w-8 h-8" />
          </div>
        </div>

        {/* P2 Card */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`flex-1 glass p-6 rounded-3xl text-center w-full max-w-sm ${showResult && winner === 'p2' ? 'ring-4 ring-green-500' : ''} ${showResult && winner === 'p1' ? 'opacity-50 grayscale' : ''}`}
        >
          <div className="mb-4">
            <span className="text-xl">{players.p2.avatar}</span>
            <p className="font-bold">{players.p2.name}</p>
          </div>
          <div className="text-6xl mb-4">{p2Country.flag}</div>
          <h3 className="text-2xl font-bold mb-4">{p2Country.name}</h3>
          
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: showResult ? `${p2Country.stats[category.id].score}%` : '0%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-red-500"
            />
          </div>
          <div className="mt-2 font-mono font-bold text-xl h-8">
            {showResult && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {p2Country.stats[category.id].display}
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>

      {showResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center w-full"
        >
          <h2 className="text-3xl font-bold mb-4 text-green-500 dark:text-green-400">
            {getWinnerMessage()}
          </h2>
          <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 p-4 rounded-2xl max-w-2xl mx-auto mb-8 text-left">
            <Info className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">{getJustification()}</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full max-w-md mx-auto py-4 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 tap-target shadow-lg shadow-primary/30 active:scale-95 transition-transform"
          >
            Próxima Rodada
            <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
