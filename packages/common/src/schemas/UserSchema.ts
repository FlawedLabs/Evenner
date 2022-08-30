import * as yup from "yup";

export const UserSchema = yup.object().shape({
    name: yup.string().min(3).max(15).required('Missing name'),
    email: yup.string().email().required('Please fill out the email'),
    password: yup.string().min(3).max(20).required(),
    role: yup.string().matches(/(USER|ADMIN)/).required()
}).required();