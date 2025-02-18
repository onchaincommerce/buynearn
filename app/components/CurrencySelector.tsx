import { useState } from 'react';
import Image from 'next/image';
import TokenSection, { tokenConfigs } from './TokenSection';

export default function CurrencySelector() {
  const [selectedToken, setSelectedToken] = useState<'USDC' | 'cbBTC' | 'ETH'>('USDC');

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Currency Selection Tabs */}
      <div className="flex justify-center gap-3 mb-4 sm:mb-8 px-2">
        {(Object.keys(tokenConfigs) as Array<keyof typeof tokenConfigs>).map((token) => (
          <button
            key={token}
            onClick={() => setSelectedToken(token)}
            className={`relative group p-2.5 sm:p-4 rounded-xl transition-all duration-300 ${
              selectedToken === token 
                ? 'bg-white/10 scale-110' 
                : 'hover:bg-white/5'
            }`}
          >
            <div className="relative">
              <Image 
                src={tokenConfigs[token].image}
                alt={token}
                width={48}
                height={48}
                className={`w-9 h-9 sm:w-12 sm:h-12 transition-all duration-300 ${
                  selectedToken === token 
                    ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                    : 'opacity-70 group-hover:opacity-100'
                }`}
                unoptimized
              />
              {/* Glow effect */}
              {selectedToken === token && (
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full -z-10" />
              )}
            </div>
            <div className={`mt-1.5 sm:mt-2 text-center text-sm sm:text-base font-medium transition-all duration-300 ${
              selectedToken === token 
                ? 'text-white scale-110' 
                : 'text-white/70 group-hover:text-white/90'
            }`}>
              {token === 'cbBTC' ? 'BTC' : token}
            </div>
          </button>
        ))}
      </div>

      {/* Active Token Section */}
      <div className="px-1 sm:px-0">
        <TokenSection 
          token={selectedToken}
          vaultAddress={selectedToken === 'USDC' 
            ? '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A'
            : selectedToken === 'cbBTC'
              ? '0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796'
              : '0xa0E430870c4604CcfC7B38Ca7845B1FF653D0ff1'
          }
        />
      </div>
    </div>
  );
} 