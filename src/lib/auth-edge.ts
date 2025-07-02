//NextAuthConfig is a type
import { NextAuthConfig } from "next-auth";
import prisma from "./db";

export const nextAuthEdgeConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");
      const isTryingToAccessProfile =
        request.nextUrl.pathname.includes("/profile");

      //user has to log in before accessing app/profile
      if (!isLoggedIn && (isTryingToAccessApp || isTryingToAccessProfile)) {
        return false;
      }

      // user can access profile if logged in
      if (isLoggedIn && isTryingToAccessProfile) {
        return true;
      }

      // user can access app if has access, redirects to payment otherwise
      if (isLoggedIn && isTryingToAccessApp && !auth?.user.hasAccess) {
        return Response.redirect(new URL("/payment", request.nextUrl));
      }
      if (isLoggedIn && isTryingToAccessApp && auth?.user.hasAccess) {
        return true;
      }

      //if user is already logged in and has access and is on a login/signup screen, redirects to dashboard
      //TODO: need to also check if user has profile details before redirecting, otherwise just redirect to profile
      if (
        isLoggedIn &&
        (request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")) &&
        auth?.user.hasAccess
      ) {
        return Response.redirect(
          new URL("/app/dashboard/gallery", request.nextUrl)
        );
      }

      //if logged in with no access and on login/signup screen, redirects to profile
      if (isLoggedIn && !isTryingToAccessApp && !auth?.user.hasAccess) {
        if (
          request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")
        ) {
          return Response.redirect(new URL("/profile", request.nextUrl));
        }

        return true;
      }

      // //if logged in with no access and on login/signup screen, redirects to profile
      // if (isLoggedIn && !isTryingToAccessApp && !auth?.user.hasAccess) {
      //   if (
      //     request.nextUrl.pathname.includes("/profile")
      //   ) {
      //     return Response.redirect(new URL("/payment", request.nextUrl));
      //   }

      //   return true;
      // }

      //if not logged in and not trying to access app, user can do whatever
      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }

      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        // on sign in
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }

      if (trigger === "update") {
        // on every request
        const userFromDb = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
        });
        if (userFromDb) {
          token.hasAccess = userFromDb.hasAccess;
        }
      }

      return token;
    },
    //when user logs in, they dont have to log in again to access something
    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.hasAccess = token.hasAccess;

      return session;
    },
  },

  //providers is where you can add different types of login methods
  providers: [],

  //satisfies is another way of specifying types
} satisfies NextAuthConfig;
