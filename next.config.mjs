import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Silence warnings
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
    webpack: (config) => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      return config;
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'raw.githubusercontent.com',
          pathname: '/Uniswap/assets/**',
        },
        {
          protocol: 'https',
          hostname: 'assets.coinbase.com',
          pathname: '/images/**',
        },
      ],
    },
  };
  
  export default withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  })(nextConfig);
  