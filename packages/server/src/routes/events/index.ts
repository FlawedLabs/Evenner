import { FastifyInstance } from 'fastify';
import { EventRequest } from '../../types/EventRequest';
import { Prisma } from '@prisma/client';
import { EventSchema, EventSchemaPatch } from 'common/src/schemas/EventSchema';
import errorHandler from '../../util/errorHandler';

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.setErrorHandler(errorHandler);

    fastify.post(
        '/',
        {
            schema: {
                body: EventSchema,
            },
        },
        async (request: EventRequest, reply) => {
            // @Optim maybe try to spread the request.body object?
            try {
                const {
                    title,
                    content,
                    published,
                    isInPerson,
                    coverPicture,
                    startDate,
                    endDate,
                    startTime,
                    endTime,
                    location,
                    position,
                    isPrivate,
                    authorId,
                } = request.body;

                const event = await fastify.prisma.event.create({
                    data: {
                        title,
                        content,
                        published,
                        coverPicture,
                        startTime,
                        endTime,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        location,
                        position: JSON.stringify(position),
                        isInPerson,
                        isPrivate,
                        authorId,
                    },
                });

                reply.code(201).send(event);
            } catch (e) {
                reply.code(500).send({
                    error: 'Internal server error',
                    message: 'Something went wrong.',
                });
            }
        }
    );

    fastify.get('/:id', async (request: EventRequest, reply) => {
        try {
            return await fastify.prisma.event.findUniqueOrThrow({
                where: {
                    id: request.params.id,
                },
                include: {
                    attendees: {
                        select: {
                            user: true,
                        },
                    },
                },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    reply.code(404).send({
                        error: 'Ressource not found on the server',
                        message: 'The event was not found.',
                    });
                }
            }

            reply.code(500).send({
                error: 'Internal server error',
                message: 'Something went wrong.',
            });
        }
    });

    fastify.get('/', async (request: any, reply) => {
        try {
            const whereData = await fastify.prisma.event.aggregate({
                where: {
                    isPrivate: false,
                    title: {
                        contains: request.query.title,
                    },
                },
                _count: true,
            });

            const totalEvent = whereData._count;
            const take = 5;
            const totalPage = Math.ceil(totalEvent / take);
            const currentPage = request.query.page;

            if (currentPage > totalPage || currentPage < 1) {
                throw new Error();
            }

            let skip = 0;
            if (currentPage > 1) {
                skip = take * (currentPage - 1);
            }

            return await fastify.prisma.event.findMany({
                take,
                skip,
                where: {
                    isPrivate: false,
                    title: {
                        contains: request.query.title,
                    },
                },
            });
        } catch (e) {
            reply.code(500).send({
                error: 'Internal server error',
                message: 'Something went wrong.',
            });
        }
    });

    fastify.patch(
        '/:id',
        {
            schema: {
                body: EventSchemaPatch,
            },
        },
        async (request: any, reply) => {
            try {
                await fastify.prisma.event.update({
                    where: {
                        id: request.params.id,
                    },
                    data: {
                        ...request.body,
                    },
                });

                reply.code(204).send();
            } catch (e: any) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code === 'P2025') {
                        reply.code(404).send({
                            error: 'Ressource not found on the server',
                            message: 'The event was not found',
                        });
                    }
                }
                reply.code(500).send({
                    error: 'Internal server error',
                    message: 'Something went wrong.',
                });
            }
        }
    );

    fastify.delete('/:id', async (request: EventRequest, reply) => {
        try {
            await fastify.prisma.event.delete({
                where: {
                    id: request.params.id,
                },
            });

            reply.code(204).send();
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    reply.code(404).send({
                        error: 'Ressource not found on the server',
                        message: 'The event was not found',
                    });
                }
            }
            reply.code(500).send({
                error: 'Internal server error',
                message: 'Something went wrong.',
            });
        }
    });

    fastify.post('/:id/register', async (request: any, reply) => {
        try {
            const usersOnEvent = await fastify.prisma.usersOnEvents.create({
                data: {
                    userId: request.body.userId,
                    eventId: request.params.id,
                },
            });

            reply.code(201).send(usersOnEvent);
        } catch (e) {
            console.log(e);
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    reply.code(404).send({
                        error: 'Ressource not found on the server',
                        message: 'The event was not found',
                    });
                }
            }
            reply.code(500).send({
                error: 'Internal server error',
                message: 'Something went wrong.',
            });
        }
    });
}
