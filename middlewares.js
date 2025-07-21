module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true, // Garante que CORS está ativado
      origin: ['http://localhost:3000'/*, 'http://localhost:1337'*/], //URL do seu frontend e do próprio Strapi
      headers: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
      expose: ['WWW-Authenticate', 'Server-Authorization'], // Expor cabeçalhos adicionais
      credentials: true, // Permite o envio de cookies de credenciais (útil para sessão, se aplicável)
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];