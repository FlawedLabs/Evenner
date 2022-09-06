import { FastifyReply, FastifyRequest } from 'fastify';

const errorHandler = (
    error: any,
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const statusCode = error.statusCode;

    let response;

    const { validation, validationContext } = error;

    if (validation) {
        response = {
            message: `A validation error occurred when validating the ${validationContext}...`,
            errors: validation,
        };
    } else {
        response = {
            message: 'An error occurred...',
        };
    }

    reply.status(statusCode).send(response);
};

export default errorHandler;
