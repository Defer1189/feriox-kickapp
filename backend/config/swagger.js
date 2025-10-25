/**
 * @fileoverview Configuración de Swagger para documentación de la API
 * @module config/swagger
 * @author FerIOX
 * @description Configuración completa de Swagger/OpenAPI para la documentación
 * interactiva de todos los endpoints de la API de integración con KICK
 */

import swaggerJsdoc from 'swagger-jsdoc';
import { app as appConfig, server } from './env.js';

/**
 * Opciones de configuración de Swagger JSDoc
 * @constant {Object} swaggerOptions
 */
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FerIOX KICK API Integration',
            version: appConfig.version,
            description: appConfig.description,
            contact: {
                name: appConfig.author,
                url: 'https://github.com/Defer1189/feriox-kickapp',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: server.backendUrl,
                description: 'Servidor de Desarrollo',
            },
            {
                url: 'https://api.feriox-kickapp.com',
                description: 'Servidor de Producción',
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'kick_access_token',
                    description: 'Token de acceso almacenado en cookie httpOnly',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Mensaje de error',
                        },
                        message: {
                            type: 'string',
                            description: 'Descripción detallada del error',
                        },
                        details: {
                            type: 'string',
                            description: 'Detalles adicionales (solo en desarrollo)',
                        },
                    },
                },
                HealthCheck: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success',
                        },
                        message: {
                            type: 'string',
                            example: '✅ Servidor FerIOX Backend funcionando correctamente',
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                        },
                        environment: {
                            type: 'string',
                            example: 'development',
                        },
                        version: {
                            type: 'string',
                            example: '1.0.0',
                        },
                    },
                },
                UserData: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success',
                        },
                        data: {
                            type: 'object',
                            description: 'Datos del usuario de KICK API',
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Health',
                description: 'Endpoints de verificación de salud del servidor',
            },
            {
                name: 'Auth',
                description: 'Endpoints de autenticación y autorización OAuth 2.1',
            },
            {
                name: 'User',
                description: 'Endpoints relacionados con datos del usuario',
            },
        ],
    },
    apis: ['./routes/*.js', './controllers/*.js', './server.js'],
};

/**
 * Especificación de Swagger generada
 * @constant {Object} swaggerSpec
 */
export const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Opciones de configuración de Swagger UI Express
 * @constant {Object} swaggerUiOptions
 */
export const swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'FerIOX KICK API Docs',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true,
    },
};

export default {
    swaggerSpec,
    swaggerUiOptions,
};
