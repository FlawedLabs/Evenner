import fastifyCookie from '@fastify/cookie';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

export default fp<FastifyPluginAsync>(async (fastify: FastifyInstance) => {
    fastify.register(fastifyCookie, {
        secret: process.env.FASTIFY_COOKIE,
    });
});
