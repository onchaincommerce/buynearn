import { Buy } from '@coinbase/onchainkit/buy'
import { Earn } from '@coinbase/onchainkit/earn'
import type { Token } from '@coinbase/onchainkit/token'
import { useState } from 'react'
import Image from 'next/image'

interface TokenSectionProps {
  token: 'USDC' | 'cbBTC' | 'ETH'
  vaultAddress: `0x${string}`
}

export const tokenConfigs: Record<'USDC' | 'cbBTC' | 'ETH', Token & { image: string }> = {
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
  },
  ETH: {
    name: 'Ethereum',
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'ETH',
    decimals: 18,
    chainId: 8453,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
  }
}

const vaultConfigs = {
  USDC: [
    {
      address: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A' as `0x${string}`,
      name: 'Spark Vault'
    },
    {
      address: '0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca' as `0x${string}`,
      name: 'Moonwell Vault'
    },
    {
      address: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738' as `0x${string}`,
      name: 'Seamless Vault'
    },
    {
      address: '0x23479229e52Ab6aaD312D0B03DF9F33B46753B5e' as `0x${string}`,
      name: 'Morpho Vault 4'
    }
  ],
  cbBTC: [
    {
      address: '0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796' as `0x${string}`,
      name: 'Moonwell Vault'
    },
    {
      address: '0x5a47C803488FE2BB0A0EAaf346b420e4dF22F3C7' as `0x${string}`,
      name: 'Seamless Vault'
    },
    {
      address: '0x6770216aC60F634483Ec073cBABC4011c94307Cb' as `0x${string}`,
      name: 'Morpho Vault 3'
    }
  ],
  ETH: [
    {
      address: '0xa0E430870c4604CcfC7B38Ca7845B1FF653D0ff1' as `0x${string}`,
      name: 'Moonwell Vault'
    },
    {
      address: '0x6b13c060F13Af1fdB319F52315BbbF3fb1D88844' as `0x${string}`,
      name: 'Gauntlet Vault'
    },
    {
      address: '0x5A32099837D89E3a794a44fb131CBbAD41f87a8C' as `0x${string}`,
      name: 'Ionic Vault'
    }
  ]
};

export default function TokenSection({ token, vaultAddress: defaultVaultAddress }: TokenSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVault, setSelectedVault] = useState(
    vaultConfigs[token].find(v => v.address === defaultVaultAddress) || vaultConfigs[token][0]
  );

  const gradientColors = {
    USDC: 'from-blue-500/20 to-green-500/20',
    cbBTC: 'from-orange-500/20 to-yellow-500/20',
    ETH: 'from-purple-500/20 to-blue-400/20'
  };

  return (
    <div 
      className="relative overflow-visible w-full max-w-md mx-auto p-2 sm:p-8 rounded-lg sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105 touch-pan-x"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ isolation: 'isolate' }}
    >
      {/* Background animation - only show on desktop */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientColors[token]} transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} rounded-lg sm:rounded-2xl hidden sm:block`} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <Image 
              src={tokenConfigs[token].image}
              alt={token} 
              width={32}
              height={32}
              className="w-8 h-8 sm:w-10 sm:h-10"
              unoptimized
            />
            <h2 className="text-xl sm:text-3xl font-bold text-white">
              {tokenConfigs[token].name}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="relative group">
              <select
                value={selectedVault.address}
                onChange={(e) => setSelectedVault(vaultConfigs[token].find(v => v.address === e.target.value)!)}
                className="appearance-none text-sm sm:text-base px-3 py-1.5 pr-8 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer backdrop-blur-sm hover:bg-white/20 transition-colors"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              >
                {vaultConfigs[token].map((vault) => (
                  <option 
                    key={vault.address} 
                    value={vault.address} 
                    className="bg-gray-900/95 backdrop-blur-sm"
                  >
                    {vault.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/80">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-y-0.5"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-blue-200 opacity-75">
              {vaultConfigs[token].length} vaults available
            </div>
          </div>
        </div>

        {/* Component Display */}
        <div className="transition-all duration-300 [&>div]:!static [&>div]:!w-full [&>div]:!max-w-full">
          <div className="animate-fadeIn space-y-4 sm:space-y-6">
            <div className="scale-[0.95] sm:scale-100 origin-top relative z-20">
              <Earn vaultAddress={selectedVault.address} />
            </div>
            <div className="mt-4 sm:mt-10 scale-[0.95] sm:scale-100 origin-top relative z-30">
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