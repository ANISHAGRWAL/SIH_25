"use client";

import React, { useState, useEffect } from "react";

interface GameProps {}

// Memory Game - Card matching with ocean theme
export default function MemoryGame({}: GameProps) {
  const [cards, setCards] = useState<Array<{
    id: number;
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
  }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const cardValues = ['🐠', '🐙', '🦀', '🐢', '🦈', '🐳', '🐡', '🦞'];

  useEffect(() => {
    const shuffledCards = [...cardValues, ...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffledCards);
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    setCards(prev => prev.map(c => 
      c.id === id ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards.find(c => c.id === firstId);
        const secondCard = cards.find(c => c.id === secondId);

        if (firstCard?.value === secondCard?.value) {
          // Match found
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
        } else {
          // No match
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="text-center mb-4 sm:mb-6">
        <div className="text-xl sm:text-2xl font-bold text-gray-700 mb-1 sm:mb-2">Memory Waves</div>
        <div className="text-base sm:text-lg text-gray-600">Moves: {moves}</div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm">
        {cards.map(card => (
          <button
            key={card.id}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg transition-all duration-300 ${
              card.isFlipped || card.isMatched
                ? 'bg-blue-100 border-2 border-blue-300'
                : 'bg-blue-400 hover:bg-blue-500 border-2 border-blue-600'
            } shadow-lg flex items-center justify-center text-xl sm:text-2xl`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.isFlipped || card.isMatched ? card.value : '🌊'}
          </button>
        ))}
      </div>

      {cards.every(card => card.isMatched) && (
        <div className="mt-4 sm:mt-6 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1 sm:mb-2">Congratulations!</div>
          <div className="text-gray-600">You completed the memory game in {moves} moves!</div>
        </div>
      )}
    </div>
  );
}