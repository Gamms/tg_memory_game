import React, { useReducer, useEffect } from 'react';
import './App.css';
import catEating from './images/cat-eat.svg'
import catDrink from './images/cat-drink-tea.svg'
import catHide from './images/cat-hiding.svg'
import catSleep from './images/cat-sleep.svg'
import catScared from './images/scaredy-cat.svg'
import catHunt from './images/cat-hunt-.svg'

// Создаем массив URL котиков (используем placeholders, так как реальные картинки могут не загрузиться)
const catImages = [
  catDrink,
  catEating,
  catHide,
  catHunt,
  catSleep,
  catScared,  
//  './images/cat-eat.svg',
//  './images/cat-hiding.svg',
//  './images/cat-hunt-.svg',
//  './images/cat-sleep.svg',
//  './images/scaredy-cat.svg',
];

const generateDeck = () => {
  const deck = [];
  // Каждому изображению добавляем две карточки
  for (let catUrl of catImages) {
    deck.push({ image: catUrl, matched: false });
    deck.push({ image: catUrl, matched: false });
  }
  // Перемешиваем колоду
  return deck.sort(() => Math.random() - 0.5);
};

const initialState = {
  deck: generateDeck(),
  flipped: [],
  matched: [],
  turns: 0,
  score: parseInt(localStorage.getItem('memory-game-score')),
  pendingReset: false,
  gameOver: false,
};

const gameReducer = (state, action) => {
  if (isNaN(state.score)){state.score=0}
  switch (action.type) {
    case 'FLIP_CARD':
      if (state.flipped.length < 2 && !state.flipped.includes(action.index) && !state.matched.includes(state.deck[action.index].image)) {
        return { ...state, flipped: [...state.flipped, action.index] };
      }
      return state;
    case 'CHECK_MATCH':
      const [first, second] = state.flipped;
      if (state.deck[first].image === state.deck[second].image) {
        const newMatched = [...state.matched, state.deck[first].image];
        const isGameOver = newMatched.length === state.deck.length / 2;
        // Сохраняем счет в localStorage для sharing button
        if (isGameOver) {
          localStorage.setItem('memory-game-score', state.score + 1);
        }
        return {
          ...state,
          matched: newMatched,
          score: isGameOver ? state.score + 1 : state.score,
          flipped: [],
          pendingReset: false,
          gameOver: isGameOver,
        };
      } else {
        return { ...state, pendingReset: true };
      }
    case 'RESET_FLIPPED':
      return { ...state, flipped: [], pendingReset: false };
    case 'INCREMENT_TURN':
      return { ...state, turns: state.turns + 1 };
    case 'RESET_GAME':
      return {
        ...initialState,
        deck: generateDeck(),
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (state.flipped.length === 2) {
      dispatch({ type: 'CHECK_MATCH' });
      dispatch({ type: 'INCREMENT_TURN' });
    }
  }, [state.flipped]);

  useEffect(() => {
    if (state.pendingReset) {
      const timer = setTimeout(() => {
        dispatch({ type: 'RESET_FLIPPED' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.pendingReset]);

  const handleCardClick = (index) => {
    if (!state.gameOver && state.flipped.length < 2 && !state.flipped.includes(index)) {
      dispatch({ type: 'FLIP_CARD', index });
    }
  };

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <div className="App">
      <h1>Котики Game</h1>
      <div className="info">
        <p>Очки: {state.score}</p>
        <p>Попытки: {state.turns}/15</p>
      </div>
      <div className="deck">
        {state.deck.map((card, index) => (
          <div
            key={index}
            className={`card ${state.flipped.includes(index) || state.matched.includes(card.image) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-inner">
              <div className="card-front">
                {/* Рубашка карты */}
                <div className="card-back-content">🐱</div>
              </div>
              <div className="card-back">
                {/* Лицевая сторона карты с изображением */}
                <img src={card.image} alt="cat" className="cat-image" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {state.gameOver && (
        <>
          <div className="overlay" />
          <div className="game-over">
            <h2>Вы выиграли!</h2>
            <button onClick={handlePlayAgain}>Заново</button>
          </div>
        </>
      )}
      {!state.gameOver && state.turns >= 15 && (
        <>
          <div className="overlay" />
          <div className="game-over">
            <h2>Игра окончена!</h2>
            <button onClick={handlePlayAgain}>Заново</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;