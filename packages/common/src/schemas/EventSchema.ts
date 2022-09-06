import * as yup from 'yup';

export const EventSchema = yup
    .object()
    .shape({
        title: yup
            .string()
            .min(3, 'The minimum length of title is 3 chars.')
            .max(255, 'The maximum length of title is 255 chars.')
            .required('The title is missing'),
        content: yup.string(),
        published: yup.boolean(),
        coverPicture: yup.string(),
        startTime: yup.string(),
        endTime: yup.string(),
        startDate: yup.date().required("The event's start date is missing"),
        endDate: yup.date().required("The event's end date is missing"),
        location: yup.string(),
        position: yup.object(),
        isInPerson: yup.boolean().required('The type of event is missing'),
        authorId: yup.string().required('The authorId is missing'),
        isPrivate: yup.boolean(),
    })
    .required();

export const EventSchemaPatch = yup.object().shape({
    title: yup
        .string()
        .min(3, 'The minimum length of title is 3 chars.')
        .max(255, 'The maximum length of title is 255 chars.'),
    content: yup.string(),
    published: yup.boolean(),
    coverPicture: yup.string(),
    startTime: yup.string(),
    endTime: yup.string(),
    startDate: yup.date(),
    endDate: yup.date(),
    location: yup.string(),
    position: yup.object(),
    isInPerson: yup.boolean(),
    authorId: yup.string(),
    isPrivate: yup.boolean(),
});
