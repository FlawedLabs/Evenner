import { prisma, Prisma } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";
import { UserSchema } from 'common/src/schemas/UserSchema';
import bcrypt from "bcrypt";
import "@sentry/tracing"

type idInRequest = FastifyRequest<{
    Params: {
        id: string;
    }
}>

type createUserRequest = FastifyRequest<{
    Body: {
        name: string;
        email: string;
        password: string;
        role?: 'USER' | 'ADMIN'
    }
}>

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.get('/:id', async (request: idInRequest, reply) => {
        const { id } = request.params;

        try {
            return await fastify.prisma.user.findFirstOrThrow({
                where: {
                    id
                }
            });

        } catch (e: any) {
            reply.code(404).send({
                statusCode: 404,
                error: "Ressource not found on the server",
                message: "User not found"
            })
        }
    })

    // Return 10 users
    fastify.get('/', async (request, reply) => {
        return await fastify.prisma.user.findMany({
            take: 10,
        });
    });

    // Create a user, validate it with the UserSchema and register his 
    fastify.post('/', {
        schema: {
            body: UserSchema
        }
    }, async (request: createUserRequest, reply) => {
        const { name, email, password, role } = request.body;

        const encryptedPassword = await bcrypt.hash(password, 10);

        try {
            return await fastify.prisma.user.create({
                data: {
                    name,
                    email,
                    password: encryptedPassword,
                    role
                }
            })
        } catch (e: any) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    reply.code(500).send({
                        error: 'Email already used',
                        message: 'An account with this email already exist'
                    })
                }
            }

            // fastify.sentry.captureException(e)
            throw e;
        }
    });

    fastify.delete('/:id', async (request: idInRequest, reply) => {
        const { id } = request.params;

        try {
            return await fastify.prisma.user.delete({
                where: {
                    id
                }
            })
        } catch (e: any) {
            if (e.code === 'P2025') {
                reply.code(404).send({
                    statusCode: 404,
                    error: 'Ressource not found on the server',
                    message: 'User not found'
                })
            }

            throw e;
        }

    })
}