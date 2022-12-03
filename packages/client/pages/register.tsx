import { Formik, Form, Field, ErrorMessage } from 'formik';
import { UserSchemaPost } from 'common/src/schemas/UserSchema';
import { BasicButton } from '../components/buttons/BasicButton';
import { toast } from 'react-toastify';
import { API_URL } from '../lib/const';
import { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';

export default function Register() {
    const { theme } = useContext(ThemeContext);

    const sendRegister = async (
        values: {
            name: string;
            email: string;
            password: string;
        },
        setSubmitting: any
    ) => {
        fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...values,
            }),
        })
            .then((res) => {
                res.json().then((formattedData) => {
                    if (res.status === 201) {
                        toast.success('User created!', { theme });
                    } else {
                        toast.error(formattedData.error, { theme });
                    }
                });
            })
            .catch((err) => {
                console.log(err);

                toast.error(err.message, {
                    theme,
                });
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <div className="container max-w-2xl mx-auto flex flex-col">
            <h1 className="text-center font-bold text-4xl">Register</h1>
            <Formik
                initialValues={{ name: '', email: '', password: '' }}
                validationSchema={UserSchemaPost}
                onSubmit={(values, { setSubmitting }) => {
                    sendRegister(values, setSubmitting);
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="mb-6">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Name
                            </label>
                            <Field
                                type="text"
                                name="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <ErrorMessage
                                className="mt-2 text-sm text-red-600 dark:text-red-500"
                                name="name"
                                component="div"
                            />
                        </div>

                        <div className="mb-6">
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Email
                            </label>
                            <Field
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="email"
                                name="email"
                            />
                            <ErrorMessage
                                className="mt-2 text-sm text-red-600 dark:text-red-500"
                                name="email"
                                component="div"
                            />
                        </div>

                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Password
                            </label>
                            <Field
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="password"
                                name="password"
                            />
                            <ErrorMessage
                                className="mt-2 text-sm text-red-600 dark:text-red-500"
                                name="password"
                                component="div"
                            />
                        </div>

                        <BasicButton type="submit" disabled={isSubmitting}>
                            Submit
                        </BasicButton>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
