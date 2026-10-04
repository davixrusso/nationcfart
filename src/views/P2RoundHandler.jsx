import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { countryData } from '../data/countryData';
import RoundDraftView from './RoundDraftView';
import { motion } from 'framer-motion';
import { Bot, Loader2 } from 'lucide-react';

export default function P2RoundHandler() {
  const { state, dispatch } = useGame();
  const { mode, difficulty, selectedCategories, players } = state;

  useEffect(() => {
    if (mode === 'bot') {
      const timer = setTimeout(() => {
        const botChoices = {};
        const pickedIds = [];

        selectedCategories.forEach(cat => {
          const available = countryData.filter(c => !pickedIds.includes(c.id));
          let chosen;

          if (difficulty === 'easy') {
            chosen = available[Math.floor(Math.random() * available.length)];
          } else {
            const sorted = [...available].sort((a, b) => (b.stats[cat.id]?.score || 0) - (a.stats[cat.id]?.score || 0));
            if (difficulty === 'hard') {
              chosen = sorted[0];
            } else {
              // Medium: pega um dos top 3
              const top = sorted.slice(0, 3);
              chosen = top[Math.floor(Math.random() * top.length)];
            }
          }

          if (chosen) {
            botChoices[cat.id] = chosen.id;
            pickedIds.push(chosen.id);
          }
        });

        dispatch({
          type: 'SET_BOT_ALL_CHOICES',
          payload: { choices: botChoices }
        });
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [mode, difficulty, selectedCategories, dispatch]);

  if (mode === 'bot') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 max-w-md mx-auto text-center space-y-6 pt-16"
      >
        <div className="w-24 h-24 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto ring-8 ring-primary/10 animate-bounce">
          <Bot className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold">{players.p2.name} está pensando...</h2>
          <p className="text-gray-400 text-sm">
            Analisando dados globais e montando a estratégia da 2ª Rodada.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-primary font-semibold">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Calculando escolhas...</span>
        </div>
      </motion.div>
    );
  }

  return <RoundDraftView playerKey="p2" />;
}
