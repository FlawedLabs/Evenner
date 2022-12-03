import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

// Generate an accessToken, and return it
export const generateAccessToken = (fastify: FastifyInstance, user: any) => {
    return fastify.jwt.sign(
        {
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        },
        { expiresIn: '1d', iss: 'Evenner', sub: user.id }
    );
};

// Generate a refreshToken and return it
export const generateRefreshToken = (fastify: FastifyInstance, user: any) => {
    return fastify.jwt.sign(
        {
            user: {
                name: user.name,
            },
        },
        { expiresIn: '1w', iss: 'Evenner', sub: user.id }
    );
};
