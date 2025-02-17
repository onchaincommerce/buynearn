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
          mode: 'auto',
        }
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}

