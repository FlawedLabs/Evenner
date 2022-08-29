import {FastifyRequest} from "fastify";

export type EventRequest = FastifyRequest<{
    Body: {
        title: string;
        content?: string;
        published?: boolean;
        coverPicture?: string;
        startTime?: string;
        endTime?: string;
        startDate: Date;
        endDate: Date;
        location?: string;
        position?: Object;
        isInPerson: boolean;
        authorId: string;
    }

    Params: {
        id: string
    }
}>
