import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Vault {
  address: `0x${string}`;
  name: string;
}

interface VaultSelectorProps {
  vaults: Vault[];
  selectedVault: Vault;
  onSelect: (vault: Vault) => void;
  token: string;
}

export default function VaultSelector({ vaults, selectedVault, onSelect, token }: VaultSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Haptic feedback function
  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5); // Subtle 5ms vibration
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <motion.div 
        className="flex flex-col items-end gap-1.5"
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={() => {
            vibrate();
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 active:bg-white/30 transition-all duration-150 text-sm sm:text-base backdrop-blur-sm"
        >
          <span>{selectedVault.name}</span>
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
            className="opacity-70"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        <div className="text-xs sm:text-sm text-blue-200 opacity-75">
          {vaults.length} vaults available
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                vibrate();
                setIsOpen(false);
              }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 sm:flex sm:items-center sm:justify-center"
            >
              <motion.div 
                className="w-full sm:w-auto sm:min-w-[24rem] max-w-lg mx-auto bg-gradient-to-b from-gray-900/95 to-black border border-white/10 rounded-t-2xl sm:rounded-2xl overflow-hidden backdrop-blur-lg shadow-2xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <h2 className="text-lg font-medium text-white mb-1">
                    Select {token} Vault
                  </h2>
                  <p className="text-sm text-gray-400">
                    Choose a vault to view APY and deposit options
                  </p>
                </div>

                {/* Vault List */}
                <div className="px-6 space-y-2 max-h-[40vh] overflow-y-auto scrollbar-hide">
                  {vaults.map((vault) => (
                    <motion.button
                      key={vault.address}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        vibrate();
                        onSelect(vault);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-150 ${
                        vault.address === selectedVault.address
                          ? 'bg-blue-500/20 border-blue-500/50 border text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 active:bg-white/15'
                      }`}
                    >
                      <span className="font-medium">{vault.name}</span>
                      {vault.address === selectedVault.address && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="text-blue-400"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Bottom Action */}
                <div className="p-4 mt-2 border-t border-white/10">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      vibrate();
                      setIsOpen(false);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 active:bg-white/20 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 