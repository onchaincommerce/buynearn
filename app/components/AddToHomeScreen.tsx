import { useState, useEffect } from 'react';

export default function AddToHomeScreen() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if already installed or in standalone mode
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                              (window.navigator as any).standalone || 
                              document.referrer.includes('android-app://');
    
    // Check if on mobile device
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    setIsStandalone(isInStandaloneMode);
    setIsMobile(isMobileDevice);
    
    // Show prompt if on mobile, not installed, and not dismissed before
    const hasPromptBeenShown = localStorage.getItem('pwaPromptShown');
    if (isMobileDevice && !isInStandaloneMode && !hasPromptBeenShown) {
      setTimeout(() => setShowPrompt(true), 1000);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptShown', 'true');
  };

  if (!showPrompt || !isMobile || isStandalone) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white z-50 animate-slideUp">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex-1 mr-4">
          <p className="text-sm font-medium">
            {isIOS ? 
              'Tap the share button ↑ then "Add to Home Screen"' : 
              'Add to Home Screen for full access'}
          </p>
        </div>
        <button 
          onClick={handleDismiss}
          className="px-3 py-1 text-sm bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
} 