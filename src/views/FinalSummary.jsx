import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { countryData } from '../data/countryData';
import { Trophy, Share2, RotateCcw, Download, CheckCircle, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import CountryFlag from '../components/CountryFlag';

export default function FinalSummary() {
  const { state, dispatch } = useGame();
  const { players, selectedCategories } = state;

  // Calcula pontuações e comparativo de cada categoria
  const roundResults = (selectedCategories || []).map((cat, idx) => {
    const p1CountryId = players.p1.choices?.[cat.id];
    const p2CountryId = players.p2.choices?.[cat.id];

    const p1Country = countryData.find(c => c.id === p1CountryId) || { name: 'Não selecionado', flag: '🏳️', stats: {} };
    const p2Country = countryData.find(c => c.id === p2CountryId) || { name: 'Não selecionado', flag: '🏳️', stats: {} };

    const p1Score = p1Country.stats?.[cat.id]?.score ?? 0;
    const p2Score = p2Country.stats?.[cat.id]?.score ?? 0;
    const p1Display = p1Country.stats?.[cat.id]?.display || `${p1Score} pts`;
    const p2Display = p2Country.stats?.[cat.id]?.display || `${p2Score} pts`;

    const diff = p1Score - p2Score;
    let winner = 'draw';
    if (diff > 0) winner = 'p1';
    else if (diff < 0) winner = 'p2';

    return {
      category: cat,
      idx: idx + 1,
      p1Country,
      p2Country,
      p1Score,
      p2Score,
      p1Display,
      p2Display,
      diff: Math.abs(diff),
      rawDiff: diff,
      winner
    };
  });

  const p1Wins = roundResults.filter(r => r.winner === 'p1').length;
  const p2Wins = roundResults.filter(r => r.winner === 'p2').length;
  const draws = roundResults.filter(r => r.winner === 'draw').length;

  let overallWinner = 'draw';
  if (p1Wins > p2Wins) overallWinner = 'p1';
  else if (p2Wins > p1Wins) overallWinner = 'p2';

  // Lança confetes se houver campeão
  useEffect(() => {
    if (overallWinner !== 'draw') {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.55 },
        colors: overallWinner === 'p1' ? ['#3b82f6', '#60a5fa', '#93c5fd'] : ['#ef4444', '#f87171', '#fca5a5']
      });
    }
  }, [overallWinner]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'NationCraft - Placar Final',
        text: `Partida finalizada no NationCraft:\n${players.p1.name} [${p1Wins}] x [${p2Wins}] ${players.p2.name}\n${overallWinner !== 'draw' ? `🏆 Vitória de ${players[overallWinner].name}!` : 'Empate!'}\nJogue você também!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Compartilhamento não suportado neste navegador.");
    }
  };

  const exportPNG = () => {
    const summaryCard = document.getElementById('summary-card');
    if (!summaryCard) return;
    html2canvas(summaryCard).then(canvas => {
      const link = document.createElement('a');
      link.download = 'nationcraft-resultado.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 max-w-4xl mx-auto space-y-8 pb-16"
      id="summary-card"
    >
      {/* Placar Geral de Destaque */}
      <div className="text-center space-y-4 pt-4">
        <Trophy className={`w-24 h-24 mx-auto ${overallWinner === 'draw' ? 'text-gray-400' : 'text-amber-400 drop-shadow-md animate-bounce'}`} />
        
        <div>
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            Resultado Final da Partida
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mt-1">
            {overallWinner === 'draw' ? 'EMPATE TOTAL!' : `🏆 ${players[overallWinner].name} VENCEU!`}
          </h2>
        </div>

        {/* Placar Principal */}
        <div className="flex justify-center items-center gap-6 sm:gap-12 bg-white/60 dark:bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl glass inline-flex mx-auto border border-black/10 dark:border-white/10 shadow-xl">
          {/* Player 1 Score */}
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-1">{players.p1.avatar}</span>
            <span className="text-sm font-bold text-gray-500">{players.p1.name}</span>
            <span className={`text-5xl sm:text-6xl font-black ${overallWinner === 'p1' ? 'text-blue-500' : ''}`}>
              {p1Wins}
            </span>
            <span className="text-xs text-gray-400 uppercase font-semibold mt-1">
              {p1Wins === 1 ? 'vitória' : 'vitórias'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl text-gray-300 dark:text-gray-600 font-light">X</span>
            {draws > 0 && (
              <span className="text-xs font-semibold text-gray-400 mt-2">
                {draws} {draws === 1 ? 'empate' : 'empates'}
              </span>
            )}
          </div>

          {/* Player 2 Score */}
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-1">{players.p2.avatar}</span>
            <span className="text-sm font-bold text-gray-500">{players.p2.name}</span>
            <span className={`text-5xl sm:text-6xl font-black ${overallWinner === 'p2' ? 'text-red-500' : ''}`}>
              {p2Wins}
            </span>
            <span className="text-xs text-gray-400 uppercase font-semibold mt-1">
              {p2Wins === 1 ? 'vitória' : 'vitórias'}
            </span>
          </div>
        </div>
      </div>

      {/* Lista Completa de Todas as Categorias com Diferença Direta */}
      <div className="glass rounded-3xl overflow-hidden shadow-lg border border-black/5 dark:border-white/5">
        <div className="p-5 border-b bg-black/5 dark:bg-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Confronto Categoria por Categoria</h3>
            <p className="text-xs text-gray-400">Comparação direta do desempenho de cada país escolhido e a diferença de pontos</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
            {roundResults.length} Categorias
          </span>
        </div>

        <div className="divide-y divide-black/5 dark:divide-white/5">
          {roundResults.map(item => {
            const isP1 = item.winner === 'p1';
            const isP2 = item.winner === 'p2';
            const isDraw = item.winner === 'draw';

            return (
              <div key={item.category.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                
                {/* Lado Player 1 */}
                <div className={`flex items-center gap-3 w-full sm:w-5/12 justify-start ${isP1 ? 'font-bold' : 'opacity-80'}`}>
                  <CountryFlag countryId={item.p1Country.id} fallbackEmoji={item.p1Country.flag} size="lg" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base truncate">{item.p1Country.name}</span>
                      {isP1 && <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full font-bold">Vencedor</span>}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      <span className="text-blue-500 font-bold">{item.p1Score} pts</span> • {item.p1Display}
                    </div>
                  </div>
                </div>

                {/* Centro: Nome da Categoria e Badge de Diferença */}
                <div className="flex flex-col items-center justify-center text-center w-full sm:w-2/12 py-1">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                    Rodada {item.idx}
                  </span>
                  <span className="text-sm font-extrabold text-foreground truncate max-w-full">
                    {item.category.name}
                  </span>
                  
                  {/* Diferença de pontos */}
                  <div className="mt-1">
                    {isDraw ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-500">
                        Empate (0 dif)
                      </span>
                    ) : (
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${isP1 ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                        +{item.diff} pts ({isP1 ? players.p1.name : players.p2.name})
                      </span>
                    )}
                  </div>
                </div>

                {/* Lado Player 2 */}
                <div className={`flex items-center gap-3 w-full sm:w-5/12 justify-end text-right ${isP2 ? 'font-bold' : 'opacity-80'}`}>
                  <div className="min-w-0">
                    <div className="flex items-center justify-end gap-1.5">
                      {isP2 && <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-bold">Vencedor</span>}
                      <span className="text-base truncate">{item.p2Country.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {item.p2Display} • <span className="text-red-500 font-bold">{item.p2Score} pts</span>
                    </div>
                  </div>
                  <CountryFlag countryId={item.p2Country.id} fallbackEmoji={item.p2Country.flag} size="lg" />
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2" data-html2canvas-ignore>
        <button
          onClick={handleShare}
          className="w-full py-4 bg-gray-200 dark:bg-gray-800 text-foreground rounded-2xl font-bold text-base flex items-center justify-center gap-2 tap-target hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <Share2 className="w-5 h-5" />
          Compartilhar
        </button>
        <button
          onClick={exportPNG}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 tap-target shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
        >
          <Download className="w-5 h-5" />
          Salvar Imagem
        </button>
        <button
          onClick={() => dispatch({ type: 'RESTART_GAME' })}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 tap-target shadow-lg shadow-primary/30 active:scale-95 transition-transform"
        >
          <RotateCcw className="w-5 h-5" />
          Nova Partida
        </button>
      </div>
    </motion.div>
  );
}
