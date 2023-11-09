import { TOTPController } from "oslo/otp";
import { SessionController, SessionCookieController } from "oslo/session";
import { Argon2id } from "oslo/password";
import { TimeSpan } from "oslo";

const totpController = new TOTPController();

const sessionController = new SessionController(new TimeSpan(30, "d"));
const sessionCookieController = new SessionCookieController(
  "electonic-attendance_session",
  sessionController.expiresIn,
  { secure: !process.dev }
);

const argon2id = new Argon2id();

export {
  totpController,
  verificationTokenController,
  sessionController,
  sessionCookieController,
  argon2id,
};
