import { TOTPController } from "oslo/otp";
import { Cookie, type CookieAttributes } from "oslo/cookie";
import { Argon2id } from "oslo/password";
import { TimeSpan } from "oslo";

const totpController = new TOTPController();

const COOKIE_NAME = "electonic-attendance_session";
const COOKIE_ATTRIBUTES: CookieAttributes = {
  maxAge: new TimeSpan(30, "d").seconds(),
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: !process.dev,
};
const createCookie = (sessionId: string) =>
  new Cookie(COOKIE_NAME, sessionId, COOKIE_ATTRIBUTES);

const argon2id = new Argon2id();

export {
  totpController,
  verificationTokenController,
  COOKIE_NAME,
  COOKIE_ATTRIBUTES,
  createCookie,
  argon2id,
};
