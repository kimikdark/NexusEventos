/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // O teu Strapi está em HTTP
        hostname: 'localhost', // O hostname do teu Strapi
        port: '1337', // A porta do teu Strapi
        pathname: '/uploads/**', // Permite todas as imagens no diretório /uploads
      },
    ],
  },
};

module.exports = nextConfig;