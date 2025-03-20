module.exports = {
    openapi: '3.0.0',
    info: {
        title: 'Item Management API',
        version: '1.0.0',
        description: 'API for managing user items.',
    },
    paths: {
        '/auth/register': {
            post: {
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                },
                                required: ['email', 'password']
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'User registered successfully' },
                    400: { description: 'User already exists' }
                }
            }
        },
        '/auth/login': {
            post: {
                summary: 'Login a user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                },
                                required: ['email', 'password']
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'User logged in successfully' },
                    401: { description: 'Invalid credentials' }
                }
            }
        },
        '/api/items': {
            post: {
                summary: 'Create a new item',
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    category: { type: 'string' }
                                },
                                required: ['title', 'description', 'category']
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Item created successfully' }
                }
            },
            get: {
                summary: 'Get all items for the authenticated user',
                security: [{ BearerAuth: [] }],
                responses: {
                    200: { description: 'List of items' }
                }
            }
        },
        '/api/items/{id}': {
            get: {
                summary: 'Get an item by ID',
                security: [{ BearerAuth: [] }],
                parameters: [{
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'integer' }
                }],
                responses: {
                    200: { description: 'Item details' },
                    404: { description: 'Item not found' }
                }
            },
            put: {
                summary: 'Update an item',
                security: [{ BearerAuth: [] }],
                parameters: [{
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'integer' }
                }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    category: { type: 'string' }
                                },
                                required: ['title', 'description', 'category']
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Item updated successfully' },
                    404: { description: 'Item not found' }
                }
            },
            delete: {
                summary: 'Delete an item',
                security: [{ BearerAuth: [] }],
                parameters: [{
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'integer' }
                }],
                responses: {
                    200: { description: 'Item deleted successfully' },
                    404: { description: 'Item not found' }
                }
            }
        },
    },
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};
