import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { countryData } from '../data/countryData';
import { Search, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DraftCard() {
  const { state, dispatch } = useGame();
  const { currentDraft, players, mode, difficulty, currentTurn, maxTurns } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  const category = currentDraft.category;
  const currentPlayerId = currentDraft.currentPlayer;
  const currentPlayer = players[currentPlayerId];

  // Filtra países já escolhidos pelo oponente nesta rodada
  const availableCountries = useMemo(() => {
    let filtered = countryData;
    if (currentPlayerId === 'p2' && currentDraft.p1Choice) {
      filtered = filtered.filter(c => c.id !== currentDraft.p1Choice);
    }
    return filtered;
  }, [currentPlayerId, currentDraft.p1Choice]);

  // Bot logic
  useEffect(() => {
    if (currentPlayerId === 'p2' && mode === 'bot') {
      const pickBotCountry = () => {
        let chosen;
        if (difficulty === 'easy') {
          // Aleatório
          chosen = availableCountries[Math.floor(Math.random() * availableCountries.length)];
        } else {
          // Hard/Medium: Ordena pelos melhores atributos da categoria
          const sorted = [...availableCountries].sort((a, b) => b.stats[category.id].score - a.stats[category.id].score);
          if (difficulty === 'hard') {
            chosen = sorted[0]; // Melhor disponível
          } else {
            // Medium: escolhe um dos top 3 aleatoriamente
            const top3 = sorted.slice(0, 3);
            chosen = top3[Math.floor(Math.random() * top3.length)];
          }
        }
        
        dispatch({
          type: 'PICK_COUNTRY',
          payload: { player: 'p2', countryId: chosen.id }
        });
      };

      const timer = setTimeout(pickBotCountry, 1500); // 1.5s delay pro bot pensar
      return () => clearTimeout(timer);
    }
  }, [currentPlayerId, mode, difficulty, availableCountries, category.id, dispatch]);

  // Timer logic
  useEffect(() => {
    if (mode === 'bot' && currentPlayerId === 'p2') return; // Sem timer pro bot
    
    setTimeLeft(30);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Tempo esgotou, escolhe aleatório
          const randomCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
          dispatch({
            type: 'PICK_COUNTRY',
            payload: { player: currentPlayerId, countryId: randomCountry.id }
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayerId, mode, availableCountries, dispatch]);

  const handlePick = (countryId) => {
    dispatch({
      type: 'PICK_COUNTRY',
      payload: { player: currentPlayerId, countryId }
    });
  };

  const filteredSearch = availableCountries.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 max-w-lg mx-auto"
    >
      <div className="text-center mb-6">
        <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-2">
          Rodada {currentTurn + 1} / {maxTurns}
        </div>
        <h2 className="text-3xl font-bold">{category.name}</h2>
        <p className="text-gray-500">Escolha o país mais forte neste quesito!</p>
      </div>

      <div className="glass p-6 rounded-3xl mb-6 relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{currentPlayer.avatar}</div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Turno de</p>
              <p className="text-xl font-bold">{currentPlayer.name}</p>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : ''}`}>
            <Timer className="w-6 h-6" />
            {timeLeft}s
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar país..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white/50 dark:bg-black/50 focus:border-primary outline-none backdrop-blur-sm"
          />
        </div>

        <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filteredSearch.map(country => (
            <button
              key={country.id}
              onClick={() => handlePick(country.id)}
              className="w-full flex items-center justify-between p-3 rounded-xl border bg-white/40 dark:bg-black/40 hover:bg-primary/10 hover:border-primary/50 transition-all text-left active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{country.flag}</span>
                <span className="font-semibold text-lg">{country.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
