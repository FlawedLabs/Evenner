import { FastifyRequest } from 'fastify';

export type SigninRequest = FastifyRequest<{
    Body: {
        email: string;
        password: string;
    };
}>;
