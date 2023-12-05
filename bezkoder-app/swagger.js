const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bezkoder API',
      version: '1.0.0',
      description: 'Documentación de la API para el proyecto Bezkoder',
    },
    servers: [
      {
        url: 'http://localhost', // Cambia esto según tu configuración
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./app/controllers/*.js', './app/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;