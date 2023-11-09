/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import("./utils/lucia").Auth;
  type DatabaseUserAttributes = {
    email: string;
    verified_at?: boolean;
    first_name: string;
    last_name: string;
    roles?: import("../drizzle/schema").ROLE[];
    telephone: string;
    created_at: bigint;
    updated_at: bigint;
  };
  type DatabaseSessionAttributes = {
    mfa_verified: boolean;
  };
}
