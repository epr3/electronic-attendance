import { TOTPController } from "oslo/otp";
import { Cookie, type CookieAttributes } from "oslo/cookie";
import { Argon2id } from "oslo/password";
import { TimeSpan } from "oslo";

const totpController = new TOTPController();

const COOKIE_NAME = "electronic-attendance_session";

const DEFAULT_TIME_SPAN = new TimeSpan(
  Number(process.env.SESSION_EXPIRY_DAYS as string),
  "d"
);

const COOKIE_ATTRIBUTES: CookieAttributes = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: !process.dev,
};
const createCookie = (sessionId: string, expires: Date) =>
  new Cookie(COOKIE_NAME, sessionId, {
    ...COOKIE_ATTRIBUTES,
    expires,
    maxAge: DEFAULT_TIME_SPAN.seconds(),
  });

const argon2id = new Argon2id();

export {
  totpController,
  verificationTokenController,
  COOKIE_NAME,
  COOKIE_ATTRIBUTES,
  createCookie,
  argon2id,
};