import {FastifyInstance} from "fastify";
import {EventRequest} from "../../types/EventRequest";
import { Prisma } from '@prisma/client'

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.post('/', async (request: EventRequest, reply) => {
        try {
            const { title, content, published, isInPerson, coverPicture, startDate, endDate, startTime, endTime, location, position, authorId } = request.body;
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
                    authorId,
                },
            })

            reply.code(201).send(event);

        } catch (e) {
            reply.code(500).send({ error: `Error during event creation` })
        }
        
    });

    fastify.get('/:id', async (request: EventRequest, reply) => {
        try {
            return await fastify.prisma.event.findUnique({
                where: {
                    id: request.params.id
                }
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    reply.code(404).send({ error: 'Event not found'})
                }
            }

            reply.code(500).send({ error: `Error during event fecthing` })
        }

    })

    fastify.get('/', async (request, reply) => {
        try {
            return await fastify.prisma.event.findMany()
        } catch (e) {
            reply.code(500).send({ error: `Error during event fecthing` })
        }
    })

    fastify.patch('/:id', async (request: EventRequest, reply) => {
        try {
            const { title, content, isInPerson, coverPicture, startDate, endDate, startTime, endTime, location, position, authorId } = request.body;
            await fastify.prisma.event.update({
                where: {
                    id: request.params.id,
                },
                data: {
                    title: title || undefined,
                    content: content || undefined,
                    isInPerson: isInPerson || undefined,
                    coverPicture: coverPicture || undefined,
                    startDate: startDate ? new Date(startDate) : undefined,
                    endDate: endDate ? new Date(endDate) : undefined,
                    startTime: startTime || undefined,
                    endTime: endTime || undefined,
                    location: location || undefined,
                    position: position ? JSON.stringify(position) : undefined,
                    authorId: authorId || undefined
                },
            })

            reply.code(204).send();
        } catch (e: any) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    reply.code(404).send({ error: 'Event not found'})
                }
            }
            reply.code(500).send({ error: `Error during event update` })
        }
    })

    fastify.delete('/:id', async (request: EventRequest, reply) => {
        try {
            await fastify.prisma.event.delete({
                where: {
                    id: request.params.id,
                },
            })

            reply.code(204).send();
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    reply.code(404).send({ error: 'Event not found'});
                }
            }
            reply.code(500).send({ error: `Error during event deletion` });
        }
    })
}
