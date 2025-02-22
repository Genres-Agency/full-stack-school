// * Comnfiguration for authentication
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";



const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Type assertion to include username property
        const userWithUsername = user as {
          id: string;
          email: string;
          username: string;
          name?: string;
          role: "ADMIN" | "TEACHER" | "STUDENT" | "USER";
        };

        token.id = userWithUsername.id;
        token.email = userWithUsername.email;
        token.username = userWithUsername.username;
        token.name = userWithUsername.name;
        token.role = userWithUsername.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.name = token.name ?? null;
        session.user.role = token.role as
          | "ADMIN"
          | "TEACHER"
          | "STUDENT"
          | "USER";
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { authOptions };
export const { auth, signIn, signOut } = handler;
export const handlers = handler;
