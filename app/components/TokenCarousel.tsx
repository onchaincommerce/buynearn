import { useState, useRef, useEffect } from 'react';
import TokenSection from './TokenSection';
import { tokenConfigs } from './TokenSection';

export default function TokenCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const tokens = ['USDC', 'cbBTC', 'ETH'] as const;
  const defaultVaults = {
    USDC: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A',
    cbBTC: '0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796',
    ETH: '0xa0E430870c4604CcfC7B38Ca7845B1FF653D0ff1'
  } as const;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!containerRef.current) return;

    const swipeThreshold = 50; // minimum distance for swipe
    const swipeDistance = touchStart - touchEnd;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0 && currentIndex < tokens.length - 1) {
        // Swipe left
        setCurrentIndex(prev => prev + 1);
      } else if (swipeDistance < 0 && currentIndex > 0) {
        // Swipe right
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  return (
    <div className="relative w-full overflow-hidden pb-12">
      <div 
        ref={containerRef}
        className="flex transition-transform duration-300 ease-out touch-pan-x px-2"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {tokens.map((token) => (
          <div key={token} className="w-full flex-shrink-0 px-2">
            <TokenSection 
              token={token} 
              vaultAddress={defaultVaults[token] as `0x${string}`}
            />
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 py-4">
        {tokens.map((token, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <span className="sr-only">View {token}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 