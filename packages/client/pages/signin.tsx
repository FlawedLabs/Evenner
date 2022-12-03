import { AuthSchema } from 'common/src/schemas/AuthSchema';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { CtxOrReq } from 'next-auth/client/_utils';
import { getCsrfToken, signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { BasicButton } from '../components/buttons/BasicButton';
import { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';

export default function Signin({ csrfToken }: { csrfToken: string }) {
    const { theme } = useContext(ThemeContext);
    const router = useRouter();

    const sendLogin = (values: any) => {
        signIn('credentials', {
            ...values,
            redirect: false,
            callbackUrl: '/',
        }).then(({ ok, error }: any) => {
            if (ok) {
                router.push('/');
            } else {
                toast.error('Credentials do not match!', { theme });
            }
        });
    };

    return (
        <div className="container max-w-2xl mx-auto flex flex-col">
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={AuthSchema}
                onSubmit={(values, { setSubmitting }) => {
                    sendLogin(values);
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="min-h-full items-center">
                        <input
                            name="csrfToken"
                            type="hidden"
                            defaultValue={csrfToken}
                        />
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Email
                        </label>
                        <Field
                            type="text"
                            name="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <ErrorMessage
                            className="mt-2 text-sm text-red-600 dark:text-red-500"
                            name="email"
                            component="div"
                        />
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Password
                        </label>
                        <Field
                            type="password"
                            name="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <ErrorMessage
                            className="mt-2 text-sm text-red-600 dark:text-red-500"
                            name="password"
                            component="div"
                        />

                        <BasicButton type="submit" disabled={isSubmitting}>
                            Submit
                        </BasicButton>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export async function getServerSideProps(context: CtxOrReq | undefined) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    };
}
