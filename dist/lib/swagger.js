"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const options = {
    definition: {
        opeonapi: '3.0.0',
        info: {
            title: 'BeepChat API',
            version: '1.0.0',
            description: 'API documentation for all endpoints',
        },
        servers: [
            { url: `http://localhost:${PORT}` }
        ]
    },
    apis: ['./routes/*.ts']
};
const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
