import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { API_URL } from '../../../lib/const';

export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
        }),
        FacebookProvider({
            clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
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
        maxAge: 30 * 24 * 60 * 60,
    },
    jwt: {
        maxAge: 60 * 60 * 24 * 30,
    },

    secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
};
export default NextAuth(authOptions);
