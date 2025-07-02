import { User } from "next-auth";

declare module "next-auth" {
  interface User {
    hasAccess: boolean;
    email: string;
  }

  interface Session {
    user: User & {
      id: string;
      // gender?: string;
      // age?: number;
      // hairColor?: string;
      // hairLength?: string;
      // ethnicity?: string;
      // bodyType?: string;
      // attire?: string;
      // backgrounds?: string;
      // glasses?: boolean;
      // images?: string[];
      // hasDetails?: boolean;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    email: string;
    hasAccess: boolean;
  }
}
