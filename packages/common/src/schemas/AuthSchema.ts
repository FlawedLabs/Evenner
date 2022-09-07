import * as yup from 'yup';

export const AuthSchema = yup
    .object()
    .shape({
        email: yup.string().email().required('Please fill out the email'),
        password: yup
            .string()
            .min(3)
            .max(20)
            .required('Please fill out the password'),
    })
    .required();
