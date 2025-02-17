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
      name: 'Morpho Vault 1'
    },
    {
      address: '0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca' as `0x${string}`,
      name: 'Morpho Vault 2'
    },
    {
      address: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738' as `0x${string}`,
      name: 'Morpho Vault 3'
    },
    {
      address: '0x23479229e52Ab6aaD312D0B03DF9F33B46753B5e' as `0x${string}`,
      name: 'Morpho Vault 4'
    }
  ],
  cbBTC: [
    {
      address: '0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796' as `0x${string}`,
      name: 'Morpho Vault 1'
    },
    {
      address: '0x5a47C803488FE2BB0A0EAaf346b420e4dF22F3C7' as `0x${string}`,
      name: 'Morpho Vault 2'
    },
    {
      address: '0x6770216aC60F634483Ec073cBABC4011c94307Cb' as `0x${string}`,
      name: 'Morpho Vault 3'
    }
  ],
  ETH: [
    {
      address: '0x2371e134e3455e0593363cBF89d3b6cf53740618' as `0x${string}`,
      name: 'Morpho Vault 1'
    },
    {
      address: '0x78Fc2c2eD1A4cDb5402365934aE5648aDAd094d0' as `0x${string}`,
      name: 'Morpho Vault 2'
    },
    {
      address: '0xBEEf050ecd6a16c4e7bfFbB52Ebba7846C4b8cD4' as `0x${string}`,
      name: 'Morpho Vault 3'
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
      className="relative overflow-visible w-full max-w-md mx-auto p-1.5 sm:p-6 rounded-lg sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl transform transition-all duration-300 hover:scale-105 touch-pan-x"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ isolation: 'isolate' }}
    >
      {/* Background animation - only show on desktop */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientColors[token]} transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} rounded-lg sm:rounded-2xl hidden sm:block`} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1 sm:mb-6">
          <div className="flex items-center gap-1 sm:gap-3">
            <Image 
              src={tokenConfigs[token].image}
              alt={token} 
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8"
              unoptimized
            />
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              {tokenConfigs[token].name}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-1">
            <select
              value={selectedVault.address}
              onChange={(e) => setSelectedVault(vaultConfigs[token].find(v => v.address === e.target.value)!)}
              className="text-xs sm:text-sm px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {vaultConfigs[token].map((vault) => (
                <option key={vault.address} value={vault.address} className="bg-gray-900">
                  {vault.name}
                </option>
              ))}
            </select>
            <div className="text-[10px] sm:text-xs text-blue-200 opacity-75">
              Select a vault to view APY
            </div>
          </div>
        </div>

        {/* Component Display */}
        <div className="transition-all duration-300 [&>div]:!static [&>div]:!w-full [&>div]:!max-w-full">
          <div className="animate-fadeIn space-y-1 sm:space-y-4">
            <div className="scale-[0.9] sm:scale-100 origin-top -mx-1 sm:mx-0 relative z-20">
              <Earn vaultAddress={selectedVault.address} />
            </div>
            <div className="mt-2 sm:mt-8 scale-[0.9] sm:scale-100 origin-top -mx-1 sm:mx-0 relative z-30">
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