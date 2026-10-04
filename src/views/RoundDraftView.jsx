import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { countryData } from '../data/countryData';
import { Search, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import CountryFlag from '../components/CountryFlag';

export default function RoundDraftView({ playerKey }) {
  const { state, dispatch } = useGame();
  const { currentRoundIndex, totalRounds, selectedCategories, players } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  const player = players[playerKey];
  const currentCategory = selectedCategories[currentRoundIndex];

  // Países já escolhidos pelo próprio jogador nas categorias anteriores desta rodada
  const chosenBySelf = Object.values(player.choices || {});
  const availableCountries = countryData.filter(c => !chosenBySelf.includes(c.id));

  // Timer individual por escolha
  useEffect(() => {
    setTimeLeft(30);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timeout: auto-seleciona aleatório
          const randomCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
          if (randomCountry) {
            handlePick(randomCountry.id);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRoundIndex, currentCategory?.id]);

  const handlePick = (countryId) => {
    setSearchTerm('');
    if (playerKey === 'p1') {
      dispatch({
        type: 'PICK_P1_CHOICE',
        payload: { categoryId: currentCategory.id, countryId }
      });
    } else {
      dispatch({
        type: 'PICK_P2_CHOICE',
        payload: { categoryId: currentCategory.id, countryId }
      });
    }
  };

  const filteredSearch = availableCountries.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentCategory) return null;

  return (
    <motion.div 
      key={`${playerKey}-${currentRoundIndex}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 max-w-xl mx-auto space-y-4"
    >
      {/* Header da Rodada do Jogador */}
      <div className="glass p-4 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{player.avatar}</div>
          <div>
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              {playerKey === 'p1' ? '1ª Rodada' : '2ª Rodada'} • {player.name}
            </span>
            <h3 className="text-xl font-bold">Escolha seu País</h3>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-lg font-bold border ${timeLeft <= 5 ? 'border-red-500 text-red-500 bg-red-500/10 animate-pulse' : 'glass'}`}>
          <Timer className="w-5 h-5" />
          {timeLeft}s
        </div>
      </div>

      {/* Categoria Ativa */}
      <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/30 p-6 rounded-3xl text-center space-y-2 relative overflow-hidden shadow-sm">
        <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-1">
          Categoria {currentRoundIndex + 1} de {totalRounds}
        </div>
        <h2 className="text-3xl font-extrabold">{currentCategory.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Qual país você quer escalar para vencer neste critério?
        </p>
      </div>

      {/* Busca e Lista de Países */}
      <div className="glass p-5 rounded-3xl space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar país por nome..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border bg-white/50 dark:bg-black/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            autoFocus
          />
        </div>

        <div className="max-h-[46vh] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filteredSearch.map(country => (
            <button
              key={country.id}
              onClick={() => handlePick(country.id)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl border bg-white/40 dark:bg-black/30 hover:bg-primary/10 hover:border-primary/50 transition-all text-left active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3.5">
                <CountryFlag countryId={country.id} fallbackEmoji={country.flag} size="md" />
                <span className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {country.name}
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-gray-500 font-medium">
                Selecionar
              </span>
            </button>
          ))}
          {filteredSearch.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              Nenhum país encontrado.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
