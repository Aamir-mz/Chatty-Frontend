import "server-only";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET!,
  session: {
    strategy: "jwt",
  },
  theme: {
    colorScheme: "dark",
  },

  providers: [
    CredentialsProvider({
      name: "Chatty",
      credentials: {
        email: { label: "Your Email", type: "email" },
        password: { label: "Your Password", type: "password" },
      },

      // Login the user
      // @ts-ignore
      authorize: async (credentials) => {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          if (!email || !password) return null;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) return null;

          // if no password is set, it means the user is using a social account
          if (!user.password) return null;

          const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
          );

          if (!isPasswordMatched) return null;

          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.name = token.name;
        // @ts-ignore
        session.user.email = token.email;
        // @ts-ignore
        session.user.image = token.image;
      }
      return session;
    },

    async jwt({ token, user }) {
      // find the user
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email! },
      });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      return {
        ...token,
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
      };
    },
  },
});
