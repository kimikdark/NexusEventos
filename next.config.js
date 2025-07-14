// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite o carregamento de imagens do teu servidor Strapi (localhost:1337)
    remotePatterns: [
      {
        protocol: 'http', // Usa 'http' porque estás a usar localhost sem SSL
        hostname: 'localhost',
        port: '1337', // A porta do teu Strapi
        pathname: '/uploads/**', // Permite qualquer caminho dentro de /uploads para as tuas imagens
      },
      // Podes adicionar outros domínios aqui se tiveres imagens de outras fontes
    ],
  },
};

module.exports = nextConfig;