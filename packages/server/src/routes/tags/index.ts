import { FastifyInstance } from 'fastify';
import errorHandler from '../../util/errorHandler';
import { TagSchema, TagSchemaPatch } from 'common/src/schemas/TagSchema';
import { TagRequest } from '../../types/TagRequestsTypes';
import pagination from '../../services/pagination';
import { Prisma } from '@prisma/client';

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.setErrorHandler(errorHandler);

    fastify.post(
        '/',
        {
            schema: {
                body: TagSchema,
            },
        },
        async (request: TagRequest, reply) => {
            try {
                const { tag } = request.body;
                const createdTag = await fastify.prisma.tag.create({
                    data: {
                        tag,
                    },
                });
                reply.code(201).send(createdTag);
            } catch (error) {
                reply.code(500).send({
                    error: {
                        error: 'Internal Server Error',
                        message: 'Something went wrong.',
                    },
                });
            }
        }
    );

    fastify.get('/:id', async (request: TagRequest, reply) => {
        try {
            const idStr = request.params.id;
            const id: number = +idStr;
            return await fastify.prisma.tag.findFirstOrThrow({
                where: {
                    id,
                },
            });
        } catch (e: any) {
            reply.code(404).send({
                error: 'Ressource not found on the server',
                message: 'Tag not found',
            });
        }
    });

    fastify.get('/', async (request: any, reply) => {
        try {
            const whereData = await fastify.prisma.tag.aggregate({
                _count: true,
            });
            const { take, skip } = pagination(
                whereData._count,
                5,
                request.query.page
            );
            return await fastify.prisma.tag.findMany({
                take,
                skip,
            });
        } catch (e: any) {
            reply.code(500).send({
                error: 'Internal Server Error',
                message: 'Something went wrong',
            });
        }
    });

    fastify.delete('/:id', async (request: TagRequest, reply) => {
        try {
            const idStr = request.params.id;
            const id: number = +idStr;
            await fastify.prisma.tag.delete({
                where: {
                    id,
                },
            });
        } catch (e: any) {
            if (e.code === 'P2025') {
                reply.code(404).send({
                    error: 'Ressource not found on the server',
                    message: 'Tag not found',
                });
            }

            reply.code(500).send({
                error: 'Internal Server Error',
                message: 'Something went wrong',
            });
        }
    });

    fastify.patch(
        '/:id',
        {
            schema: {
                body: TagSchemaPatch,
            },
        },
        async (request: any, reply) => {
            try {
                const idStr = request.params.id;
                const id: number = +idStr;
                return await fastify.prisma.tag.update({
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
                            error: {
                                error: 'Error Not Found',
                                message: 'The tag was not found',
                            },
                        });
                    }
                }
                reply.code(500).send({
                    error: {
                        error: 'Internal Server Error',
                        message: 'Something went wrong.',
                    },
                });
            }
        }
    );
}
