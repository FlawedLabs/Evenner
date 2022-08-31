import Fastify from 'fastify';

import path from 'path';
import autoLoad from '@fastify/autoload';

const fastify = Fastify({ logger: true });

fastify.register(require('@fastify/cors'), {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});

fastify.register(autoLoad, {
    dir: path.join(__dirname, 'plugins'),
});

fastify.register(autoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { prefix: '/api' },
});

fastify.listen({ port: 4000 }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Server running on http://localhost:4000');
});
