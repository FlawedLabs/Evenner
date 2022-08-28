import {FastifyInstance} from "fastify";
import {EventRequest} from "../../types/EventRequest";
import { Prisma } from '@prisma/client'

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.post('/', async (request: EventRequest, reply) => {
        try {
            const { title, content, isInPerson, coverPicture, startDate, endDate, startTime, endTime, location, position, authorId } = request.body;
            return await fastify.prisma.event.create({
                data: {
                    title,
                    content,
                    isInPerson,
                    coverPicture,
                    startDate: new Date(),
                    endDate: new Date(),
                    startTime,
                    endTime,
                    location,
                    position: JSON.stringify(position),
                    authorId: '1'
                },
            })
        } catch (e) {
            console.error('events', e)

            reply
                .code(500)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send({ error: `Error during event creation` })
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
            console.error('events', e)

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
            console.error('events', e)
            reply
                .code(500)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send({ error: `Error during event fecthing` })
        }
    })

    fastify.patch('/:id', async (request: EventRequest, reply) => {
        try {
            const { title, content, isInPerson, coverPicture, startDate, endDate, startTime, endTime, location, position, authorId } = request.body;
            return await fastify.prisma.event.update({
                where: {
                    id: request.params.id,
                },
                data: {
                    title,
                    content,
                    isInPerson,
                    coverPicture,
                    startDate: new Date(),
                    endDate: new Date(),
                    startTime,
                    endTime,
                    location,
                    position: JSON.stringify(position),
                    authorId: '1'
                },
            })
        } catch (e: any) {
            console.error('events', e)

            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    reply
                        .code(404)
                        .header('Content-Type', 'application/json; charset=utf-8')
                        .send({ error: 'Event not found'})
                }
            }

            reply
                .code(500)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send({ error: `Error during event update` })
        }
    })

    fastify.delete('/:id', async (request: EventRequest, reply) => {
        try {
            return await fastify.prisma.event.delete({
                where: {
                    id: request.params.id,
                },
            })
        } catch (e) {
            console.error('events', e);
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    reply
                        .code(404)
                        .header('Content-Type', 'application/json; charset=utf-8')
                        .send({ error: 'Event not found'});
                }
            }
            reply
                .code(500)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send({ error: `Error during event deletion` });
        }
    })
}
