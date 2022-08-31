import { FastifyInstance, FastifyRequest } from 'fastify';
import { EventRequest } from '../../types/EventRequest';
import { prisma, Prisma } from '@prisma/client';
import { eventSchema } from 'common';

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.post('/', async (request: EventRequest, reply) => {
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
            const eventData = {
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
            };

            //await eventSchema.validate(eventData);

            const event = await fastify.prisma.event.create(eventData);

            reply.code(201).send(event);
        } catch (e) {
            reply.code(500).send(e);
        }
    });

    fastify.get('/:id', async (request: EventRequest, reply) => {
        try {
            return await fastify.prisma.event.findUnique({
                where: {
                    id: request.params.id,
                },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    reply.code(404).send({ error: 'Event not found' });
                }
            }

            reply.code(500).send({ error: `Error during event fecthing` });
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

            if (request.query.page > whereData._count / 5) {
                throw new Error();
            }

            let skip = 0;
            if (request.query.page > 1) {
                skip = 5 * request.query.page;
            }

            return await fastify.prisma.event.findMany({
                take: 5,
                skip,
                where: {
                    isPrivate: false,
                    title: {
                        contains: request.query.title,
                    },
                },
            });
        } catch (e) {
            reply.code(500).send({ error: `Error during event fecthing` });
        }
    });

    fastify.patch('/:id', async (request: EventRequest, reply) => {
        try {
            const {
                title,
                content,
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
            await fastify.prisma.event.update({
                where: {
                    id: request.params.id,
                },
                data: {
                    title: title || undefined,
                    content: content || undefined,
                    isInPerson: isInPerson || undefined,
                    isPrivate: isPrivate || undefined,
                    coverPicture: coverPicture || undefined,
                    startDate: startDate ? new Date(startDate) : undefined,
                    endDate: endDate ? new Date(endDate) : undefined,
                    startTime: startTime || undefined,
                    endTime: endTime || undefined,
                    location: location || undefined,
                    position: position ? JSON.stringify(position) : undefined,
                    authorId: authorId || undefined,
                },
            });

            reply.code(204).send();
        } catch (e: any) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    reply.code(404).send({ error: 'Event not found' });
                }
            }
            reply.code(500).send({ error: `Error during event update` });
        }
    });

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
                    reply.code(404).send({ error: 'Event not found' });
                }
            }
            reply.code(500).send({ error: `Error during event deletion` });
        }
    });
}
