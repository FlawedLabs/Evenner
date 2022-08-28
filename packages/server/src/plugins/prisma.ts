import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

const prismaPlugin: FastifyPluginAsync = fp(async (fastify, options) => {
    const prisma = new PrismaClient();

    await prisma.$connect();

    // Make Prisma Client available through the fastify server instance: server.prisma
    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async (fastify) => {
        await fastify.prisma.$disconnect();
    });
});

export default prismaPlugin;
