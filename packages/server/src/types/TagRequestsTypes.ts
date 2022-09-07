import { FastifyRequest } from 'fastify';

export type TagRequest = FastifyRequest<{
    Body: {
        tag: string;
    };

    Params: {
        id: string;
    };
}>;
