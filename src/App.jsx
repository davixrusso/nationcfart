import React from 'react';
import Header from './components/Header';
import ModeSelect from './views/ModeSelect';
import { useGame } from './context/GameContext';
import RoundDraftView from './views/RoundDraftView';
import PassTurnView from './views/PassTurnView';
import P2RoundHandler from './views/P2RoundHandler';
import FinalSummary from './views/FinalSummary';

function AppContent() {
  const { state } = useGame();

  return (
    <div className="min-h-screen pb-10">
      <Header />
      <main className="container mx-auto">
        {state.view === 'SETUP' && <ModeSelect />}
        {state.view === 'P1_ROUND' && <RoundDraftView playerKey="p1" />}
        {state.view === 'PASS_TURN' && <PassTurnView />}
        {state.view === 'P2_ROUND' && <P2RoundHandler />}
        {state.view === 'SUMMARY' && <FinalSummary />}
      </main>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
