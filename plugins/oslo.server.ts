import { VerificationTokenController } from "oslo/token";
import { TOTPController } from "oslo/otp";
import { TimeSpan } from "oslo";

const totpController = new TOTPController();
const verificationTokenController = new VerificationTokenController(
  new TimeSpan(2, "h")
);

export default defineNuxtPlugin(() => {
  return {
    provide: {
      totpController,
      verificationTokenController,
    },
  };
});
