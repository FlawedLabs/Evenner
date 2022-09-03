import { FastifyInstance, FastifyRequest } from 'fastify';
import { EventRequest } from '../../types/EventRequest';
import { prisma, Prisma } from '@prisma/client';
import { EventSchema } from 'common/src/schemas/EventSchema';
import errorHandler from '../../util/errorHandler';

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.setErrorHandler(errorHandler);

    fastify.post(
        '/',
        {
            schema: {
                body: EventSchema,
            },
            // @ts-ignore
            validatorCompiler: ({ schema, method, url, httpPart }) => {
                return function (data) {
                    try {
                        // @ts-ignore
                        const result = schema.validateSync(data, {
                            strict: false,
                            abortEarly: false,
                            stripUnknown: true,
                            recursive: true,
                        });
                        return { value: result };
                    } catch (err: any) {
                        const errors: Array<{ name: string; message: string }> =
                            [];
                        err.inner.forEach((e: { path: any; message: any }) => {
                            errors.push({ name: e.path, message: e.message });
                        });

                        return { error: errors };
                    }
                };
            },
        },
        async (request: EventRequest, reply) => {
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
                reply.code(500).send(e);
            }
        }
    );

    fastify.get('/:id', async (request: EventRequest, reply) => {
        try {
            const event = await fastify.prisma.event.findUnique({
                where: {
                    id: request.params.id,
                },
            });

            if (!event) {
                throw new Prisma.PrismaClientKnownRequestError(
                    'Event not found',
                    'P2025',
                    Prisma.prismaVersion.client
                );
            }

            return event;
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
