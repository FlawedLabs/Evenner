import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head />
            <body className="flex h-full flex-col bg-slate-50 dark:bg-[#060d1f]">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
