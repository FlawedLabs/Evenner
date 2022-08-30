import { Prisma } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";
import { UserSchema } from 'common/src/schemas/UserSchema';
import bcrypt from "bcrypt";
import errorHandler from '../../util/errorHandler';
import "@sentry/tracing"

type createUserRequest = FastifyRequest<{
    Body: {
        name: string;
        email: string;
        password: string;
        role?: 'USER' | 'ADMIN'
    }
}>

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.setErrorHandler(errorHandler);

    fastify.get('/', async (request, reply) => {
        return await fastify.prisma.user.findMany();
    });

    fastify.post('/', {
        schema: {
            body: UserSchema
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
                        recursive: true
                    })
                    return { value: result }
                } catch (err: any) {
                    const errors: Array<{ name: string, message: string }> = [];
                    err.inner.forEach((e: { path: any; message: any; }) => {
                        errors.push({ name: e.path, message: e.message })
                    })

                    return { error: errors }
                }
            }
        }
    }, async (request: createUserRequest, reply) => {
        const transaction = await fastify.sentry.startTransaction({
            op: "usercreation",
            name: "User Creation Benchmark"
        })

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
        } finally {
            transaction.finish();
        }
    })
}