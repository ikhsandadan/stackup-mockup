import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { connectToDatabase } from "@/app/utils/mongodb";
import User from "@/app/utils/user";

// Define a TypeScript interface for credentials
interface Credentials {
    email: string;
    password: string;
}

// Define a TypeScript interface for User, matching your database schema
interface UserType {
    _id: string;
    email: string;
    password: string;
    username: string;
}

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            type: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials: Credentials | undefined) {
                if (!credentials) {
                    return null;
                }

                const { email, password } = credentials;

                try {
                    await connectToDatabase();

                    // Find the user by email
                    const user = await User.findOne({ email }).select("_id email password username") as UserType | null;

                    if (!user) {
                        return null;
                    }

                    // Check if the password matches
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (!passwordMatch) {
                        return null;
                    }

                    // Return the user object if authentication is successful
                    return { id: user._id, email: user.email, username: user.username };
                } catch (error: any) {
                    console.log("Error while authorizing user: ", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ account, token, user } : any) {
            if (account?.provider === "credentials") {
                token.email = user.email;
                token.username = user.username;
            }

            return token;
        },

        async session({ session, token } : any) {
            if ("email" in token) {
                session.user.email = token.email;
            }

            if ("username" in token) {
                session.user.username = token.username;
            }

            if ("sub" in token) {
                session.user.id = token.sub;
            }

            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/", // Path to your sign-in page
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
