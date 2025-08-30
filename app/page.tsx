'use client';

import { useState } from "react";
import CardOne from "../components/CardOne";
import CardTwo from "../components/CardTwo";
import CardThree from "../components/CardThree";
import CardFour from "../components/CardFour";
import CardFive from "../components/CardFive";

export default function Home() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCardClick = (cardId: string) => {
    setExpandedCard(cardId);
  };

  const handleCloseExpanded = () => {
    setExpandedCard(null);
  };

  // If CardOne is expanded, show only CardOne in fullscreen
  if (expandedCard === 'card-one') {
    return (
      <div className="fixed inset-0 z-50 bg-white p-4">
        <div className="relative w-full h-full">
          {/* <button
            onClick={handleCloseExpanded}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button> */}
          <CardOne isExpanded={true} onClose={handleCloseExpanded} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      {/* First Row */}
      <div className="flex flex-1 gap-4">
        {/* Card 1: 25% width */}
        <div className="w-[25%]">
          <CardOne onClick={() => handleCardClick('card-one')} />
        </div>
        {/* Card 5: 20% width */}
        <div className="w-[20%]">
          <CardFive />
        </div>
        {/* Card 2: 60% width */}
        <div className="w-[60%]">
          <CardTwo />
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-1 gap-4 h-full">
        {/* Card 3: 2/3 width */}
        <CardThree />
        {/* Card 4: 1/3 width */}
        <CardFour />
      </div>
    </div>
  );
}
