/**
 * Swagger Configuration for FerIOX Kick App API
 * @module SwaggerConfig
 */

import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FerIOX Kick App API',
            version: '1.0.0',
            description: 'API completa para la integración con KICK mediante OAuth 2.1',
            contact: {
                name: 'FerIOX',
                url: 'https://github.com/Defer1189/feriox-kickapp',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desarrollo',
            },
            {
                url: 'https://api.tudominio.com',
                description: 'Servidor de Producción',
            },
        ],
        tags: [
            {
                name: 'Health',
                description: 'Endpoints de verificación de salud del servidor',
            },
            {
                name: 'Authentication',
                description: 'Endpoints de autenticación OAuth 2.1',
            },
            {
                name: 'User',
                description: 'Endpoints de datos del usuario (protegidos)',
            },
            {
                name: 'Debug',
                description: 'Endpoints de depuración (solo desarrollo)',
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
                HealthResponse: {
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
                ServiceInfo: {
                    type: 'object',
                    properties: {
                        service: {
                            type: 'string',
                            example: 'FerIOX KICK API Integration',
                        },
                        developer: {
                            type: 'string',
                            example: 'FerIOX',
                        },
                        status: {
                            type: 'string',
                            example: 'active',
                        },
                        version: {
                            type: 'string',
                            example: '1.0.0',
                        },
                        message: {
                            type: 'string',
                            example: 'Escalado Horizontal, Ambición Vertical - KICK Dev',
                        },
                        endpoints: {
                            type: 'object',
                        },
                    },
                },
                UserResponse: {
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
                LogoutResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success',
                        },
                        message: {
                            type: 'string',
                            example: 'Sesión cerrada correctamente',
                        },
                        redirect: {
                            type: 'string',
                            example: '/dashboard?logout=success',
                        },
                    },
                },
                ConfigResponse: {
                    type: 'object',
                    properties: {
                        client_id: {
                            type: 'string',
                            example: '✅ Configurado',
                        },
                        redirect_uri: {
                            type: 'string',
                            example: 'http://localhost:3000/api/auth/callback',
                        },
                        has_client_secret: {
                            type: 'boolean',
                            example: true,
                        },
                        environment: {
                            type: 'string',
                            example: 'development',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            example: 'Error message',
                        },
                        message: {
                            type: 'string',
                            example: 'Detailed error message',
                        },
                        details: {
                            type: 'string',
                            description: 'Additional details (only in development)',
                        },
                    },
                },
            },
        },
    },
    apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
