"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerJsDoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BeepChat Documentation',
            version: '1.0.0',
            description: 'Find all the API endpoints',
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api/v1`,
            },
        ],
    },
    apis: ['./src/v1/**/*.route.js'],
};
const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;
