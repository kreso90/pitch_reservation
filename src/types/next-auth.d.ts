// types/next-auth.d.ts
import { FieldReservation } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      reservations: FieldReservation[];
      isAdmin: boolean;
    };
  }

  interface JWT {
    id: string;
    reservations?: FieldReservation[];
    randomKey?: string;
    isAdmin: boolean;
  }
}
