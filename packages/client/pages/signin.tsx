import { AuthSchema } from 'common/src/schemas/AuthSchema';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { CtxOrReq } from 'next-auth/client/_utils';
import {
    ClientSafeProvider,
    getCsrfToken,
    LiteralUnion,
    signIn,
} from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { BasicButton } from '../components/buttons/BasicButton';
import { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';
import SSOButton from '../components/buttons/SSOButton';
import { getProviders } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import LineText from '../components/misc/LineText';
import Link from 'next/link';

export default function Signin({
    csrfToken,
    providers,
}: {
    csrfToken: string;
    providers: Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    >;
}) {
    const { theme } = useContext(ThemeContext);
    const router = useRouter();

    const sendLogin = (values: any, setSubmitting: Function) => {
        signIn('credentials', {
            ...values,
            redirect: false,
            callbackUrl: '/',
        }).then(({ ok, error }: any) => {
            if (ok) {
                router.push('/');
            } else {
                setSubmitting(false);
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
                    sendLogin(values, setSubmitting);
                    setSubmitting(true);
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="min-h-full items-center">
                        <input
                            name="csrfToken"
                            type="hidden"
                            defaultValue={csrfToken}
                        />
                        <div className="mb-6">
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
                        </div>

                        <div className="mb-6">
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
                        </div>

                        <BasicButton
                            className="w-full"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Sign in
                        </BasicButton>
                    </Form>
                )}
            </Formik>

            <LineText>Or continue with</LineText>

            {Object.values(providers).map((provider, i) => {
                if (provider.name === 'Credentials') {
                    return null;
                }

                return (
                    <SSOButton
                        className={i === 0 ? '' : 'mt-2'}
                        provider={provider.name}
                        onClick={() =>
                            signIn(provider.id, {
                                callbackUrl: 'http://localhost:3000',
                            })
                        }
                        key={provider.name}
                    />
                );
            })}

            <div className="flex flex-col items-center mt-4">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Don't have an account?
                </p>
                <Link
                    href="/register"
                    className="text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                >
                    Sign up
                </Link>
            </div>
        </div>
    );
}

export async function getServerSideProps(context: CtxOrReq | undefined) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
            providers: await getProviders(),
        },
    };
}
