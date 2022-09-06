import * as yup from 'yup';

// Validate the creation of a user on both frontend and backend
export const UserSchemaPost = yup
    .object()
    .shape({
        name: yup.string().min(3).max(15).required('Missing name'),
        email: yup.string().email().required('Please fill out the email'),
        password: yup.string().min(3).max(20).required(),
        role: yup
            .string()
            .matches(/(USER|ADMIN)/)
            .required(),
    })
    .required();

export const UserSchemaPatch = yup
    .object()
    .shape({
        name: yup.string().min(3).max(15),
        email: yup.string().email(),
        password: yup.string().min(3).max(20),
        role: yup.string().matches(/(USER|ADMIN)/),
    })
    .required();
