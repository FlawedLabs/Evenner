import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { API_URL } from '../../../lib/const';
import { decode } from 'jsonwebtoken';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'pol@na.ref',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                const res = await fetch(`${API_URL}/auth/signin`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { 'Content-Type': 'application/json' },
                });

                const user = await res.json();

                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user;
                }

                // Return null if user data could not be retrieved
                return null;
            },
        }),
    ],
    pages: {
        signIn: '/signin',
    },
    session: {
        jwt: true,
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.accessToken = user.accessToken;
                token.id = user.id;
            }

            return token;
        },
        async session({ session, token, user }: any) {
            // Really not happy with this, but it works for now, don't even know if it's correct
            const decodedToken = decode(token.accessToken);
            session.accessToken = token.accessToken;
            session.id = token.id;
            session.user = { ...decodedToken.user };

            return session;
        },
    },

    secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
};
export default NextAuth(authOptions);
