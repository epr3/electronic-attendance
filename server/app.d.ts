/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import("./utils/lucia").Auth;
  type DatabaseUserAttributes = {
    email: string;
    verifiedAt?: boolean;
    firstName: string;
    lastName: string;
    roles?: import("../drizzle/schema").ROLE[];
    telephone: string;
  };
  type DatabaseSessionAttributes = {
    mfaVerified: boolean;
  };
}
