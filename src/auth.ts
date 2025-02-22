import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Define the User type based on your Prisma schema
type UserWithRole = {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "USER";
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      role: "ADMIN" | "TEACHER" | "STUDENT" | "USER";
    };
  }

  interface User extends UserWithRole {}
}

declare module "next-auth/jwt" {
  interface JWT extends UserWithRole {}
}

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
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = user.name;
        token.role = user.role as "ADMIN" | "TEACHER" | "STUDENT" | "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
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
