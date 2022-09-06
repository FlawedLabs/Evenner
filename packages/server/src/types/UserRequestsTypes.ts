import { FastifyRequest } from 'fastify';

export type idInRequest = FastifyRequest<{
    Params: {
        id: string;
    };
}>;

export type createUserRequest = FastifyRequest<{
    Body: {
        name: string;
        email: string;
        password: string;
        role?: 'USER' | 'ADMIN';
    };
}>;

// @Optim Should try to make a union with createUserRequest and idInRequest
export type updateUserRequest = FastifyRequest<{
    Params: {
        id: string;
    };
    Body: {
        name: string;
        email: string;
        password: string;
        role?: 'USER' | 'ADMIN';
    };
}>;
