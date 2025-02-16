import { Buy } from '@coinbase/onchainkit/buy'
import { Earn } from '@coinbase/onchainkit/earn'
import type { Token } from '@coinbase/onchainkit/token'
import { useState } from 'react'

interface TokenSectionProps {
  token: 'USDC' | 'cbBTC'
  vaultAddress: `0x${string}`
}

const tokenConfigs: Record<'USDC' | 'cbBTC', Token> = {
  USDC: {
    name: 'USDC',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    symbol: 'USDC',
    decimals: 6,
    chainId: 8453,
    image: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
  },
  cbBTC: {
    name: 'Bitcoin',
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    symbol: 'BTC',
    decimals: 8,
    chainId: 8453,
    image: '/cbBTC.png'
  }
}

export default function TokenSection({ token, vaultAddress }: TokenSectionProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showBuyFlow, setShowBuyFlow] = useState(false)

  return (
    <div 
      className="relative overflow-visible w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ isolation: 'isolate' }}
    >
      {/* Background animation */}
      <div className={`absolute inset-0 bg-gradient-to-r ${token === 'USDC' ? 'from-blue-500/20 to-green-500/20' : 'from-orange-500/20 to-yellow-500/20'} transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img 
              src={tokenConfigs[token].image || undefined}
              alt={token} 
              className="w-8 h-8"
            />
            <h2 className="text-2xl font-bold text-white">
              {tokenConfigs[token].name}
            </h2>
          </div>
        </div>

        {/* Component Display */}
        <div className="transition-all duration-300 [&>div]:!static [&>div]:!w-full [&>div]:!max-w-full [&_*]:!z-[60]">
          {showBuyFlow ? (
            <div className="animate-fadeIn space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBuyFlow(false)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ←
                  </button>
                  <h3 className="text-lg font-semibold text-white">Buy {tokenConfigs[token].name}</h3>
                </div>
                <div className="text-sm text-white/60">
                  to start earning yield
                </div>
              </div>
              <Buy 
                toToken={tokenConfigs[token]} 
                isSponsored
              />
            </div>
          ) : (
            <div className="animate-fadeIn space-y-4">
              <Earn vaultAddress={vaultAddress} />
              <div className="mt-4">
                <button
                  onClick={() => setShowBuyFlow(true)}
                  className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <span>Buy {tokenConfigs[token].name}</span>
                  <img 
                    src="https://assets.coinbase.com/images/favicon.ico" 
                    alt="Coinbase" 
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 