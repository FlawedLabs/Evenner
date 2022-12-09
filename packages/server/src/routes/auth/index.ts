import { FastifyInstance } from 'fastify';
import { SigninRequest } from '../../types/AuthRequestsTypes';
import { AuthSchema } from 'common/src/schemas/AuthSchema';
import { compare } from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../../util/jwtToken';

export default async function (fastify: FastifyInstance) {
    // Signin route, generate two tokens, an access one and a refresh token and add the
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

                const isPasswordValid = await compare(password, user.password);

                if (!isPasswordValid) {
                    reply.code(401).send({
                        error: 'Unauthorized',
                        message: 'Invalid credentials.',
                    });
                }

                // Generate an access token and a refresh token and store it in a cookie
                const accessToken = generateAccessToken(fastify, user);
                const refreshToken = generateRefreshToken(fastify, user);

                /* @TODO Check security issues, rotating secret?
                 * https://github.com/fastify/fastify-cookie#rotating-signing-secret
                 * Update domain based on env
                 */

                // Might trigger the wrong error if the cookie env is not set LMAO!
                reply.setCookie('jid_token', refreshToken, {
                    httpOnly: true,
                    domain: 'localhost',
                    path: '/',
                    sameSite: true,
                    signed: true,
                });

                return user;
            } catch (e: any) {
                reply.code(404).send({
                    error: 'Ressource not found on the server',
                    message: 'User not found',
                });
            }
        }
    );

    fastify.post('/logout', async (request, reply) => {});
}
