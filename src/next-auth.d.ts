import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the User type
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string; // Add role property
  }

  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      role: string; // Ensure role is included in the session
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    email: string;
    username: string;
    role: string;
  }
}
