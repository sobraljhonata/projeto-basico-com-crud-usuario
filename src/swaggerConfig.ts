const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API para gerenciamento de usuários',
    },
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos de rotas
};

const specs = swaggerJsdoc(options);

export {
  swaggerUi,
  specs,
};
