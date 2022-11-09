import {
    FastifyError,
    FastifyInstance,
    FastifyPluginAsync,
    FastifyReply,
    FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';
import fastifyAuth, { FastifyAuthFunction } from '@fastify/auth';
import { generateAccessToken } from '../util/jwtToken';

declare module 'fastify' {
    interface FastifyInstance {
        verifyJwt: FastifyAuthFunction;
        checkAdmin: FastifyAuthFunction;
    }
}

export default fp<FastifyPluginAsync>(async (fastify: FastifyInstance) => {
    fastify.register(fastifyAuth);

    // Check if the user has an active JWT token
    // If not, check the refresh token, and create a new access token
    fastify.decorate(
        'verifyJwt',
        (request: FastifyRequest, reply: FastifyReply, done: Function) => {
            try {
                // Maybe read from the cookie instead of the authorization header..
                // I'm tired so do whatever you want

                if (request.headers.authorization) {
                    const tokenHeader = request.headers.authorization;
                    const [, token] = tokenHeader.split(' ');

                    fastify.jwt.verify(token);

                    return done();
                }
            } catch (e: any) {
                if (e.code === 'FAST_JWT_EXPIRED') {
                    if (request.cookies?.jid_token) {
                        try {
                            const refreshToken = request.cookies.jid_token;
                            const unsignedRefreshToken =
                                request.unsignCookie(refreshToken);

                            const payload: {
                                user: { name: string };
                                iss: 'Evenner';
                                sub: string;
                                iat: number;
                                exp: number;
                            } = fastify.jwt.verify(unsignedRefreshToken.value!);

                            const accessToken = generateAccessToken(fastify, {
                                id: payload.sub,
                                name: payload.user.name,
                            });

                            request.headers.authorization = `Bearer ${accessToken}`;

                            return done();
                        } catch (e: any) {
                            // The refresh token expired, so redirect to login page
                            reply.code(401).send({
                                error: 'Unauthorized',
                                message: 'Please log in again',
                            });
                        }
                    } else {
                        // No refresh token provided
                        reply.code(401).send({
                            error: 'Unauthorized',
                            message: 'Please try to connect',
                        });
                    }
                }

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
        async (request: FastifyRequest, reply: FastifyReply) => {
            let payload: any = {};
            try {
                payload = await request.jwtVerify();

                if (payload.user.role !== 'ADMIN') {
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
});
