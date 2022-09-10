import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyReply,
    FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';
import fastifyAuth, { FastifyAuthFunction } from '@fastify/auth';
import { User } from '@prisma/client';

declare module 'fastify' {
    interface FastifyInstance {
        verifyJwt: FastifyAuthFunction;
        checkAdmin: FastifyAuthFunction;
    }
}

export default fp<FastifyPluginAsync>(async (fastify: FastifyInstance) => {
    fastify.register(fastifyAuth);

    // Check if the user has an active JWT token
    fastify.decorate(
        'verifyJwt',
        async (
            request: FastifyRequest,
            reply: FastifyReply,
            done: Function
        ) => {
            try {
                const tokenData: any = await request.jwtVerify();
            } catch (e: any) {
                reply.code(500).send({
                    error: 'Invalid Token',
                    message: 'Error while verifying the token',
                });
            }
        }
    );

    // Check if the active user is an admin
    fastify.decorate(
        'checkAdmin',
        async (
            request: FastifyRequest,
            reply: FastifyReply,
            done: Function
        ) => {
            try {
                const tokenData: any = await request.jwtVerify();

                if (tokenData.user.role !== 'ADMIN') {
                    reply.code(401).send({
                        error: 'Unauthorized',
                        message: 'Missing role',
                    });
                }
            } catch (e: any) {
                reply.code(500).send({
                    error: 'Invalid Token',
                    message: 'Error while verifying the token',
                });
            }
        }
    );

    fastify.auth;
});
