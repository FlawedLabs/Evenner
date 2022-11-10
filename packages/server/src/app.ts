import Fastify from 'fastify';
import errorHandler from './util/errorHandler';
import autoLoad from '@fastify/autoload';
import yupValidatorCompiler from './util/yupValidatorCompiler';
import * as dotenv from 'dotenv';
dotenv.config();

import path from 'path';

const fastify = Fastify({ logger: true });

fastify.setErrorHandler(errorHandler);
fastify.setValidatorCompiler(yupValidatorCompiler);

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
