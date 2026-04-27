import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.points = (user as any).points;
        token.rank = (user as any).rank;
      }
      if (trigger === "update") {
        if (session?.role) token.role = session.role;
        if (session?.points !== undefined) token.points = session.points;
        if (session?.rank) token.rank = session.rank;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).points = token.points;
        (session.user as any).rank = token.rank;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as any)?.role;
      
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      const isPublicRoute = ["/", "/login", "/register", "/cart"].some(path => 
        nextUrl.pathname === path || nextUrl.pathname.startsWith("/books/")
      );
      const isAuthRoute = ["/login", "/register"].includes(nextUrl.pathname);

      if (isApiAuthRoute) return true;

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      if (!isLoggedIn && !isPublicRoute) {
        return false;
      }

      // Seller dashboard protection - Allow all logged in users
      if (nextUrl.pathname.startsWith("/seller") || nextUrl.pathname.startsWith("/chat")) {
        return isLoggedIn;
      }

      // Admin dashboard protection
      if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
