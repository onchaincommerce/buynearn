'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      chain={base}
      projectId={process.env.NEXT_PUBLIC_COINBASE_SPONSORED_PROJECT_ID}
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      config={{ 
        appearance: { 
          theme: 'cyberpunk'
        }
      }}
    >
      <style jsx global>{`
        /* Override input text color for better contrast */
        input[type="number"],
        input[type="text"] {
          color: #000 !important;
          background-color: rgba(255, 255, 255, 0.9) !important;
        }
        
        /* Cyberpunk theme enhancements */
        .wallet-container button {
          text-shadow: 0 0 10px currentColor;
        }
        
        select option {
          background-color: #1a1a1a;
          color: white;
        }

        /* Additional cyberpunk styling */
        button {
          border-color: #00ff9d !important;
        }
        
        button:hover {
          box-shadow: 0 0 15px #00ff9d !important;
        }
      `}</style>
      {props.children}
    </OnchainKitProvider>
  );
}

