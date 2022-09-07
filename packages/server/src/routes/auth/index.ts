import { FastifyInstance } from 'fastify';
import { SigninRequest } from '../../types/AuthRequestsTypes';
import { AuthSchema } from 'common/src/schemas/AuthSchema';
import bcrypt from 'bcrypt';

export default async function (fastify: FastifyInstance, opts: any) {
    fastify.post(
        '/signin',
        {
            schema: {
                body: AuthSchema,
            },
        },
        async (request: SigninRequest, reply) => {
            const { email, password } = request.body;

            try {
                const user = await fastify.prisma.user.findUniqueOrThrow({
                    where: {
                        email,
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        password: true,
                        role: true,
                    },
                });

                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isPasswordValid) {
                    reply.code(401).send({
                        error: 'Unauthorized',
                        message: 'Invalid credentials.',
                    });
                }

                return fastify.jwt.sign({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                });
            } catch (e: any) {
                reply.code(404).send({
                    error: 'Ressource not found on the server',
                    message: 'User not found',
                });
            }
        }
    );
}
