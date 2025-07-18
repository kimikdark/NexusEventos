// next.config.ts
import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  // Configurações de imagens (movidas de next.config.js)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
};

// Aplica o plugin Flowbite React à configuração do Next.js
export default withFlowbiteReact(nextConfig);