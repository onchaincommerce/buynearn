'use client';

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import TokenSection, { tokenConfigs } from './components/TokenSection';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import AddToHomeScreen from './components/AddToHomeScreen';

function FloatingLogos() {
  const baseLogoRef = useRef<HTMLImageElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleClick = (e: MouseEvent) => {
      const particleCount = 12;
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '0';
      container.style.top = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '9999';
      document.body.appendChild(container);

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '20px';
        particle.style.height = '20px';
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        particle.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
        particle.style.opacity = '1';
        
        const img = document.createElement('img');
        img.src = '/base-logo.png';
        img.alt = 'Base';
        img.style.width = '100%';
        img.style.height = '100%';
        particle.appendChild(img);
        container.appendChild(particle);

        const angle = (i * 360) / particleCount;
        const distance = 100;
        const rad = angle * Math.PI / 180;
        
        setTimeout(() => {
          particle.style.transform = `translate(${Math.cos(rad) * distance}px, ${Math.sin(rad) * distance}px) rotate(${angle}deg)`;
          particle.style.opacity = '0';
        }, 0);

        setTimeout(() => {
          container.remove();
        }, 1000);
      }
    };
    
    const animate = () => {
      if (!baseLogoRef.current) return;
      
      const speed = 0.1;
      const rect = baseLogoRef.current.getBoundingClientRect();
      const targetX = mousePos.current.x - rect.width / 2;
      const targetY = mousePos.current.y - rect.height / 2;
      
      const currentTransform = new DOMMatrix(getComputedStyle(baseLogoRef.current).transform);
      const currentX = currentTransform.m41 || 0;
      const currentY = currentTransform.m42 || 0;
      
      const newX = currentX + (targetX - currentX) * speed;
      const newY = currentY + (targetY - currentY) * speed;
      
      baseLogoRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      
      requestAnimationFrame(animate);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    animate();
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, []);
  
  return (
    <>
      <Image
        ref={baseLogoRef as any}
        src="/base-logo.png"
        alt="Base"
        width={40}
        height={40}
        className="fixed w-10 h-10 transition-all duration-75 ease-out hover:scale-110 pointer-events-none z-[9999]"
        style={{ 
          filter: 'brightness(0.8) contrast(1.2)',
          transform: 'translate(-50px, -50px)'
        }}
        priority
      />
    </>
  );
}

export default function App() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if in standalone mode
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                              (window.navigator as any).standalone || 
                              document.referrer.includes('android-app://');
    setIsStandalone(isInStandaloneMode);
  }, []);

  return (
    <OnchainKitProvider 
      chain={base}
      projectId={process.env.NEXT_PUBLIC_COINBASE_SPONSORED_PROJECT_ID}
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
    >
      <FloatingLogos />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-2 sm:px-4 max-w-6xl">
          {/* Header with wallet */}
          <header className="pt-12 sm:pt-6 pb-4 sm:pb-6 flex justify-center items-center relative z-40">
            <div className={`wallet-container scale-90 sm:scale-100 origin-center ${isStandalone ? 'mt-0' : ''}`}>
              <Wallet>
                <ConnectWallet>
                  <Avatar className="h-6 w-6" />
                  <Name />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </header>

          {/* Main content */}
          <main className="py-4 sm:py-12">
            {/* Hero section */}
            <div className="text-center mb-6 sm:mb-16 relative px-2 sm:px-4">
              <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-6">
                Instantly Buy USDC and BTC without KYC and earn yield
              </h2>
              {!isStandalone && (
                <p className="text-base sm:text-xl text-blue-200 max-w-2xl mx-auto">
                  Add to home screen to start buying and earning. No KYC required, just connect your wallet and start earning competitive yields on Base.
                </p>
              )}
            </div>

            {isStandalone ? (
              /* Token sections - Only shown in standalone mode */
              <div className="flex flex-col md:grid md:grid-cols-2 gap-3 sm:gap-8 mt-4 sm:mt-8 relative z-20">
                <TokenSection
                  token="USDC"
                  vaultAddress={"0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A" as `0x${string}`}
                />
                <TokenSection
                  token="cbBTC"
                  vaultAddress={"0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796" as `0x${string}`}
                />
              </div>
            ) : (
              /* Info sections - Only shown in browser mode */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-8 mt-4 sm:mt-8 relative z-20">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Image 
                      src={tokenConfigs.USDC.image}
                      alt="USDC"
                      width={32}
                      height={32}
                      className="w-8 h-8"
                      unoptimized
                    />
                    <h3 className="text-xl font-bold">USDC</h3>
                  </div>
                  <p className="text-blue-200 mb-2">• Buy instantly with card or Coinbase account</p>
                  <p className="text-blue-200 mb-2">• Earn {8.44}% APY through Morpho</p>
                  <p className="text-blue-200">• Withdraw anytime, no lockup period</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Image 
                      src={tokenConfigs.cbBTC.image}
                      alt="Bitcoin"
                      width={32}
                      height={32}
                      className="w-8 h-8"
                      unoptimized
                    />
                    <h3 className="text-xl font-bold">Bitcoin</h3>
                  </div>
                  <p className="text-blue-200 mb-2">• Buy BTC without exchange signup</p>
                  <p className="text-blue-200 mb-2">• Earn yield on your Bitcoin</p>
                  <p className="text-blue-200">• Fully backed by real BTC</p>
                </div>
              </div>
            )}

            {/* Features section - Always shown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-8 mt-6 sm:mt-16 relative z-10">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-6 transform hover:scale-105 transition-transform">
                <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3">🔒 Secure by Design</h3>
                <p className="text-sm sm:text-base text-blue-200">Built on Base with institutional-grade security. Your assets are protected by Coinbase&apos;s battle-tested infrastructure.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-6 transform hover:scale-105 transition-transform">
                <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3">💰 Optimized Returns</h3>
                <p className="text-sm sm:text-base text-blue-200">Earn competitive yields through Morpho&apos;s efficient lending protocol. Maximum returns with minimal risk.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 sm:p-6 transform hover:scale-105 transition-transform">
                <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3">⚡ Instant Access</h3>
                <p className="text-sm sm:text-base text-blue-200">Buy tokens directly with your card or Coinbase account. Deposit and withdraw anytime with no lockup periods.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
      <AddToHomeScreen />
    </OnchainKitProvider>
  );
}
