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
import { useEffect, useRef } from 'react';

function FloatingLogos() {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseLogoRef = useRef<HTMLImageElement>(null);
  const cbBTCLogoRef = useRef<HTMLImageElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const explosionParticles = useRef<HTMLDivElement[]>([]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleClick = (e: MouseEvent) => {
      // Create explosion particles
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
        const particle = document.createElement('img');
        particle.src = '/base-logo.png';
        particle.style.position = 'absolute';
        particle.style.width = '20px';
        particle.style.height = '20px';
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        particle.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
        particle.style.opacity = '1';
        container.appendChild(particle);

        // Calculate random direction
        const angle = (i * 360) / particleCount;
        const distance = 100;
        const rad = angle * Math.PI / 180;
        
        // Animate particle
        setTimeout(() => {
          particle.style.transform = `translate(${Math.cos(rad) * distance}px, ${Math.sin(rad) * distance}px) rotate(${angle}deg)`;
          particle.style.opacity = '0';
        }, 0);

        // Clean up particle
        setTimeout(() => {
          container.remove();
        }, 1000);
      }
    };
    
    const animate = () => {
      if (!baseLogoRef.current) return;
      
      // Smooth follow effect for base logo
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
      <img
        ref={baseLogoRef}
        src="/base-logo.png"
        alt="Base"
        className="fixed w-10 h-10 transition-all duration-75 ease-out hover:scale-110 pointer-events-none z-[9999]"
        style={{ 
          filter: 'brightness(0.8) contrast(1.2)',
          transform: 'translate(-50px, -50px)'
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <OnchainKitProvider 
      chain={base}
      projectId={process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID}
      apiKey={process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID}
    >
      <FloatingLogos />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          {/* Header with wallet */}
          <header className="py-6 flex justify-between items-center relative z-50">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Buy & Earn
            </h1>
            <div className="wallet-container">
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
          <main className="py-12">
            {/* Hero section */}
            <div className="text-center mb-16 relative">
              <h2 className="text-5xl font-bold mb-6">
                Buy & Earn on Base
              </h2>
              <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                Buy USDC and Bitcoin instantly, then earn yield on Base. Connect your wallet and watch your assets grow.
              </p>
            </div>

            {/* Token sections */}
            <div className="grid md:grid-cols-2 gap-8 mt-8 relative z-20">
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
            <div className="grid md:grid-cols-3 gap-8 mt-16 relative z-10">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-transform">
                <h3 className="text-xl font-bold mb-3">🔒 Secure by Design</h3>
                <p className="text-blue-200">Built on Base with institutional-grade security. Your assets are protected by Coinbase's battle-tested infrastructure.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-transform">
                <h3 className="text-xl font-bold mb-3">💰 Optimized Returns</h3>
                <p className="text-blue-200">Earn competitive yields through Morpho's efficient lending protocol. Maximum returns with minimal risk.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-transform">
                <h3 className="text-xl font-bold mb-3">⚡ Instant Access</h3>
                <p className="text-blue-200">Buy tokens directly with your card or Coinbase account. Deposit and withdraw anytime with no lockup periods.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </OnchainKitProvider>
  );
}
