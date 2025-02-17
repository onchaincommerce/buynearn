import { Buy } from '@coinbase/onchainkit/buy'
import { Earn } from '@coinbase/onchainkit/earn'
import type { Token } from '@coinbase/onchainkit/token'
import { useState } from 'react'
import Image from 'next/image'

interface TokenSectionProps {
  token: 'USDC' | 'cbBTC'
  vaultAddress: `0x${string}`
}

export const tokenConfigs: Record<'USDC' | 'cbBTC', Token & { image: string }> = {
  USDC: {
    name: 'USDC',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    symbol: 'USDC',
    decimals: 6,
    chainId: 8453,
    image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png'
  },
  cbBTC: {
    name: 'Bitcoin',
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    symbol: 'BTC',
    decimals: 8,
    chainId: 8453,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
  }
}

export default function TokenSection({ token, vaultAddress }: TokenSectionProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative overflow-visible w-full max-w-md mx-auto p-1.5 sm:p-6 rounded-lg sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ isolation: 'isolate' }}
    >
      {/* Background animation */}
      <div className={`absolute inset-0 bg-gradient-to-r ${token === 'USDC' ? 'from-blue-500/20 to-green-500/20' : 'from-orange-500/20 to-yellow-500/20'} transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} rounded-lg sm:rounded-2xl`} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1 sm:mb-6">
          <div className="flex items-center gap-1 sm:gap-3">
            <Image 
              src={tokenConfigs[token].image}
              alt={token} 
              width={32}
              height={32}
              className="w-4 h-4 sm:w-8 sm:h-8"
              unoptimized
            />
            <h2 className="text-base sm:text-2xl font-bold text-white">
              {tokenConfigs[token].name}
            </h2>
          </div>
        </div>

        {/* Component Display */}
        <div className="transition-all duration-300 [&>div]:!static [&>div]:!w-full [&>div]:!max-w-full">
          <div className="animate-fadeIn space-y-1 sm:space-y-4">
            <div className="scale-[0.85] sm:scale-100 origin-top -mx-1 sm:mx-0 relative z-20">
              <Earn vaultAddress={vaultAddress} />
            </div>
            <div className="mt-1 sm:mt-8 scale-[0.85] sm:scale-100 origin-top -mx-1 sm:mx-0 relative z-30">
              <Buy 
                toToken={tokenConfigs[token]} 
                isSponsored
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 