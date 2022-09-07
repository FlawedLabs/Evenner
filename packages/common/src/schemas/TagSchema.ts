import * as yup from 'yup';

export const TagSchema = yup
    .object()
    .shape({
        tag: yup
            .string()
            .min(3, 'The minimum length of a tag is 3 chars.')
            .max(20, 'The maximum length of a tag is 20 chars.')
            .required('The tag is missing.'),
    })
    .required();

export const TagSchemaPatch = yup.object().shape({
    tag: yup
        .string()
        .min(3, 'The minimum length of a tag is 3 chars.')
        .max(20, 'The maximum length of a tag is 20 chars.'),
});
