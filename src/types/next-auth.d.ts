import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: "AGENT" | "BROKERAGE";
    hasProfile: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: "AGENT" | "BROKERAGE";
      hasProfile: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "AGENT" | "BROKERAGE";
    hasProfile: boolean;
  }
}
