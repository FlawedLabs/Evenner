import '../styles/globals.css';
import type { AppProps } from 'next/app';
import ThemeProvider from '../components/theme/ThemeProvider';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <SessionProvider session={session}>
            <ThemeProvider>
                <ToastContainer />
                <Component {...pageProps} />;
            </ThemeProvider>
        </SessionProvider>
    );
}

export default MyApp;
