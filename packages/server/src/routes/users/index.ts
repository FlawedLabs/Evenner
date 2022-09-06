import { Prisma } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { UserSchemaPost, UserSchemaPatch } from 'common/src/schemas/UserSchema';
import {
    idInRequest,
    createUserRequest,
    updateUserRequest,
} from '../../types/UserRequestsTypes';
import bcrypt from 'bcrypt';
import '@sentry/tracing';

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.get('/:id', async (request: idInRequest, reply) => {
        const { id } = request.params;

        try {
            return await fastify.prisma.user.findFirstOrThrow({
                where: {
                    id,
                },
            });
        } catch (e: any) {
            reply.code(404).send({
                error: 'Ressource not found on the server',
                message: 'User not found',
            });
        }
    });

    // Return 10 users
    fastify.get('/', async (request, reply) => {
        return await fastify.prisma.user.findMany({
            take: 10,
            orderBy: {
                createdAt: 'desc',
            },
        });
    });

    // Create a user, validate it with the UserSchema and register his
    fastify.post(
        '/',
        {
            schema: {
                body: UserSchemaPost,
            },
        },
        async (request: createUserRequest, reply) => {
            const { name, email, password, role } = request.body;

            const encryptedPassword = await bcrypt.hash(password, 10);

            try {
                const user = await fastify.prisma.user.create({
                    data: {
                        name,
                        email,
                        password: encryptedPassword,
                        role,
                    },
                });

                reply.code(201).send(user);
            } catch (e: any) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === 'P2002') {
                        reply.code(500).send({
                            error: 'Email already used',
                            message: 'An account with this email already exist',
                        });
                    }
                }

                throw e;
            }
        }
    );

    fastify.patch(
        '/:id',
        {
            schema: {
                body: UserSchemaPatch,
            },
        },
        async (request: updateUserRequest, reply) => {
            const { id } = request.params;

            // If password is specified, then encrypt it and save it in the body
            request.body.password = await bcrypt.hash(
                request.body.password,
                10
            );

            try {
                return await fastify.prisma.user.update({
                    where: {
                        id,
                    },
                    data: {
                        ...request.body,
                    },
                });
            } catch (e: any) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === 'P2025') {
                        reply.code(404).send({
                            error: 'Ressource not found on the server',
                            message: 'User not found',
                        });
                    }

                    if (e.code === 'P2002') {
                        reply.code(500).send({
                            error: 'Email already used',
                            message: 'An account with this email already exist',
                        });
                    }
                }

                throw e;
            }
        }
    );

    fastify.delete('/:id', async (request: idInRequest, reply) => {
        const { id } = request.params;

        try {
            return await fastify.prisma.user.delete({
                where: {
                    id,
                },
            });
        } catch (e: any) {
            if (e.code === 'P2025') {
                reply.code(404).send({
                    error: 'Ressource not found on the server',
                    message: 'User not found',
                });
            }

            throw e;
        }
    });
}
