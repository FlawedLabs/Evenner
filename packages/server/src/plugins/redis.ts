import fastifyRedis from '@fastify/redis';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

export default fp<FastifyPluginAsync>(async (fastify: FastifyInstance) => {
    fastify.register(fastifyRedis, {
        host: '127.0.0.1',
    });
});
