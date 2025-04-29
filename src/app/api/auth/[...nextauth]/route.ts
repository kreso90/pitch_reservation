import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../../lib/prisma";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;
      
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
      
        if (!user) return null;
      
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password ?? '');
      
        if (!isPasswordValid) return null;
      
        return user;
      }
      
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email) {
          return "No profile email found";
        }
  
        try {
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });
  
          if (existingAccount) {
            return true;
          } else {

            const newUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name,
                emailVerified: profile.email.endsWith('@gmail.com')
                  ? new Date()
                  : null,
              },
            });
  
            await prisma.account.create({
              data: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                userId: newUser.id,
                type: account.type
              },
            });
  
            return true;
          }
        } catch (error) {
          console.error("Error in signIn callback", error);
          return "Error creating or updating user in the database";
        }
      }
  
      return true;
    },
    session: ({ session, token }) => {
    
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
          reservations: token.reservations || []
        },
      };
    },
    jwt: async ({ token, user }) => {
      const userId = user?.id ?? token.id;
    
      if (userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          include: { fieldReservation: true },
        });
        
        return {
          ...token,
          id: userId,
          randomKey: (user as any)?.randomKey ?? token.randomKey,
          reservations: dbUser?.fieldReservation ?? [],
        };
      }
    
      return token;
    },
  },
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }