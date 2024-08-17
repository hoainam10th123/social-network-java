import { ResponseLogin } from "@/app/lib/models/responseLogin";
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: ResponseLogin & DefaultSession["user"]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: ResponseLogin;
  }
}