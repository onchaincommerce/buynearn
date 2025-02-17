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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if in standalone mode
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                              (window.navigator as any).standalone || 
                              document.referrer.includes('android-app://');
    
    // Check if on mobile device
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    setIsStandalone(isInStandaloneMode);
    setIsMobile(isMobileDevice);
  }, []);

  // Show full app if:
  // 1. On desktop (not mobile) OR
  // 2. On mobile AND launched from home screen
  const shouldShowFullApp = !isMobile || (isMobile && isStandalone);

  return (
    <OnchainKitProvider 
      chain={base}
      projectId={process.env.NEXT_PUBLIC_COINBASE_SPONSORED_PROJECT_ID}
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
    >
      {shouldShowFullApp ? (
        // Full app view when on desktop or launched from home screen on mobile
        <>
          <FloatingLogos />
          <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
            <div className="container mx-auto px-2 sm:px-4 max-w-6xl">
              {/* Header with wallet */}
              <header className="pt-12 sm:pt-6 pb-4 sm:pb-6 flex justify-center items-center relative z-40">
                <div className="wallet-container scale-90 sm:scale-100 origin-center">
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
                {/* Token sections */}
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
              </main>
            </div>
          </div>
        </>
      ) : (
        // Simple welcome view when accessed via mobile browser
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="flex justify-center gap-4 mb-8">
              <Image 
                src={tokenConfigs.USDC.image}
                alt="USDC"
                width={40}
                height={40}
                className="w-10 h-10"
                unoptimized
              />
              <Image 
                src={tokenConfigs.cbBTC.image}
                alt="Bitcoin"
                width={40}
                height={40}
                className="w-10 h-10"
                unoptimized
              />
            </div>
            <h1 className="text-2xl font-bold mb-4">
              Buy & Earn on Base
            </h1>
            <p className="text-blue-200 mb-6">
              Instantly buy USDC and BTC without KYC, then earn yield on Base.
            </p>
            <div className="animate-pulse text-sm text-blue-300">
              Add to home screen to start →
            </div>
          </div>
        </div>
      )}
      {isMobile && <AddToHomeScreen />}
    </OnchainKitProvider>
  );
}
