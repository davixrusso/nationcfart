import React, { createContext, useContext, useReducer } from 'react';
import { categories } from '../data/countryData';

const GameContext = createContext();

const initialState = {
  view: 'SETUP', // SETUP, P1_ROUND, PASS_TURN, P2_ROUND, REVEAL, SUMMARY
  mode: '1v1', // '1v1' or 'bot'
  difficulty: 'medium', // 'easy', 'medium', 'hard'
  totalRounds: 5,
  currentRoundIndex: 0,
  selectedCategories: [],
  players: {
    p1: { name: 'Jogador 1', avatar: '😎', score: 0, choices: {} },
    p2: { name: 'Jogador 2', avatar: '🤖', score: 0, choices: {} }
  },
  revealIndex: 0
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const shuffledCategories = [...categories].sort(() => 0.5 - Math.random());
      const rounds = action.payload.totalRounds || action.payload.maxTurns || 5;
      const selectedCategories = shuffledCategories.slice(0, rounds);
      
      return {
        ...state,
        view: 'P1_ROUND',
        mode: action.payload.mode,
        difficulty: action.payload.difficulty || state.difficulty,
        totalRounds: selectedCategories.length,
        currentRoundIndex: 0,
        selectedCategories,
        players: {
          p1: { name: action.payload.p1Name || 'Jogador 1', avatar: action.payload.p1Avatar || '😎', score: 0, choices: {} },
          p2: { 
            name: action.payload.mode === 'bot' ? 'IA Bot' : (action.payload.p2Name || 'Jogador 2'), 
            avatar: action.payload.mode === 'bot' ? '🤖' : (action.payload.p2Avatar || '🤓'), 
            score: 0, 
            choices: {} 
          }
        },
        revealIndex: 0
      };
    }

    case 'PICK_P1_CHOICE': {
      const { categoryId, countryId } = action.payload;
      const newChoices = { ...state.players.p1.choices, [categoryId]: countryId };
      const nextIdx = state.currentRoundIndex + 1;

      if (nextIdx >= state.totalRounds) {
        if (state.mode === 'bot') {
          return {
            ...state,
            players: {
              ...state.players,
              p1: { ...state.players.p1, choices: newChoices }
            },
            currentRoundIndex: 0,
            view: 'P2_ROUND'
          };
        } else {
          return {
            ...state,
            players: {
              ...state.players,
              p1: { ...state.players.p1, choices: newChoices }
            },
            currentRoundIndex: 0,
            view: 'PASS_TURN'
          };
        }
      }

      return {
        ...state,
        players: {
          ...state.players,
          p1: { ...state.players.p1, choices: newChoices }
        },
        currentRoundIndex: nextIdx
      };
    }

    case 'START_P2_ROUND': {
      return {
        ...state,
        view: 'P2_ROUND',
        currentRoundIndex: 0
      };
    }

    case 'PICK_P2_CHOICE': {
      const { categoryId, countryId } = action.payload;
      const newChoices = { ...state.players.p2.choices, [categoryId]: countryId };
      const nextIdx = state.currentRoundIndex + 1;

      if (nextIdx >= state.totalRounds) {
        return {
          ...state,
          players: {
            ...state.players,
            p2: { ...state.players.p2, choices: newChoices }
          },
          currentRoundIndex: 0,
          view: 'SUMMARY'
        };
      }

      return {
        ...state,
        players: {
          ...state.players,
          p2: { ...state.players.p2, choices: newChoices }
        },
        currentRoundIndex: nextIdx
      };
    }

    case 'SET_BOT_ALL_CHOICES': {
      return {
        ...state,
        players: {
          ...state.players,
          p2: { ...state.players.p2, choices: action.payload.choices }
        },
        view: 'SUMMARY'
      };
    }

    case 'SET_REVEAL_SCORES': {
      const { p1Score, p2Score } = action.payload;
      return {
        ...state,
        players: {
          ...state.players,
          p1: { ...state.players.p1, score: p1Score },
          p2: { ...state.players.p2, score: p2Score }
        }
      };
    }

    case 'FINISH_GAME': {
      return {
        ...state,
        view: 'SUMMARY'
      };
    }

    case 'RESTART_GAME': {
      return { ...initialState };
    }

    case 'SET_VIEW': {
      return { ...state, view: action.payload.view };
    }

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
