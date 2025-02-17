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
import TokenSection from './components/TokenSection';
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
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header with wallet */}
          <header className="py-4 sm:py-6 flex justify-between items-center relative z-40">
            {!isStandalone && (
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Buy & Earn
              </h1>
            )}
            <div className={`wallet-container scale-90 sm:scale-100 origin-right ${isStandalone ? 'ml-auto mt-6' : ''}`}>
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
          <main className="py-8 sm:py-12">
            {/* Hero section */}
            <div className="text-center mb-12 sm:mb-16 relative px-4">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
                Buy & Earn on Base
              </h2>
              <p className="text-lg sm:text-xl text-blue-200 max-w-2xl mx-auto">
                Buy USDC and Bitcoin instantly, then earn yield on Base. Connect your wallet and watch your assets grow.
              </p>
            </div>

            {/* Token sections */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8 relative z-20">
              <TokenSection
                token="USDC"
                vaultAddress={"0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A" as `0x${string}`}
              />
              <TokenSection
                token="cbBTC"
                vaultAddress={"0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796" as `0x${string}`}
              />
            </div>

            {/* Features section */}
            <div className="grid md:grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 relative z-10">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 transform hover:scale-105 transition-transform">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">🔒 Secure by Design</h3>
                <p className="text-sm sm:text-base text-blue-200">Built on Base with institutional-grade security. Your assets are protected by Coinbase&apos;s battle-tested infrastructure.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 transform hover:scale-105 transition-transform">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">💰 Optimized Returns</h3>
                <p className="text-sm sm:text-base text-blue-200">Earn competitive yields through Morpho&apos;s efficient lending protocol. Maximum returns with minimal risk.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 transform hover:scale-105 transition-transform">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">⚡ Instant Access</h3>
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
