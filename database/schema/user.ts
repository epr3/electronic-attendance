import type { Insertable, Selectable, Updateable } from "kysely";

export enum TOKEN_TYPE {
  VALIDATION = "VALIDATION",
  RESET_PASSWORD = "RESET_PASSWORD",
}

export enum ROLE {
  ADMIN = "ADMIN",
  DIRECTOR = "DIRECTOR",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
}

export interface UsersTable {
  id: string;
  firstName: string;
  lastName: string;
  address?: string;
  email: string;
  telephone: string;
  mfaEnabled?: boolean;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export interface UserMfasTable {
  id: string;
  userId: string;
  secret: string;
  emailOnly: boolean;
}

export type UserMfa = Selectable<UserMfasTable>;
export type NewUserMfa = Insertable<UserMfasTable>;
export type UserMfaUpdate = Updateable<UserMfasTable>;

export interface UserKeysTable {
  id: string;
  userId: string;
  hashedPassword: string;
}

export type UserKey = Selectable<UserKeysTable>;
export type NewUserKey = Insertable<UserKeysTable>;
export type UserKeyUpdate = Updateable<UserKeysTable>;

export interface TokensTable {
  id: string;
  email: string;
  token: string;
  type: TOKEN_TYPE;
  expiresAt: string;
}

export type Token = Selectable<TokensTable>;
export type NewToken = Insertable<TokensTable>;
export type TokenUpdate = Updateable<TokensTable>;

export interface UserSessionsTable {
  id: string;
  userId: string;
  mfaVerified?: boolean;
  createdAt: string;
}

export type UserSession = Selectable<UserSessionsTable>;
export type NewUserSession = Insertable<UserSessionsTable>;
export type UserSessionUpdate = Updateable<UserSessionsTable>;