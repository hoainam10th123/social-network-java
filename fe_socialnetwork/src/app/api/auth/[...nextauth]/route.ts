import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" }
      },
      async authorize(credentials, req) {
        const credentialDetails = {
          username: credentials?.username,
          password: credentials?.password,
        };

        try {
          const res = await fetch(`${process.env.NEXTAUTH_URL_INTERNAL}account/login`, {
            method: 'POST',
            body: JSON.stringify(credentialDetails),
            headers: { "Content-Type": "application/json" }
          })

          const user = await res.json()

          if (res.ok && user) {
            return user
          }
        } catch (error) {
          console.log(error)
        }
        return null
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.user = user as any;
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session) {
        session.user = token.user as any;
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }