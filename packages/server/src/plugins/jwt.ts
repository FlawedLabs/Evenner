import fastifyJwt, { FastifyJWTOptions, Secret } from '@fastify/jwt';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export default fp<FastifyJWTOptions>(async (fastify: FastifyInstance) => {
    fastify.register(fastifyJwt, {
        secret: process.env.FASTIFY_JWT as Secret,
    });
});
