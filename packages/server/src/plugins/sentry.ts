import * as Sentry from '@sentry/node';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
    interface FastifyInstance {
        sentry: typeof Sentry;
    }
}

const sentryPlugin: FastifyPluginAsync = fp(async (fastify, options) => {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 1.0,
    });

    fastify.addHook('onError', (request, reply, error, done) => {
        // Probably should check the status code on error before capturing all errors, maybe capture only error.statusCode >= 400?
        if (process.env.NODE_ENV !== 'development') {
            Sentry.captureException(error);
        }
        done();
    });

    fastify.decorate('sentry', Sentry);
});

export default sentryPlugin;
