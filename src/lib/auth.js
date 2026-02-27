// lib/auth.js
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable is not defined. Please set it in .env.local"
  );
}
export const COOKIE_NAME = "token";

// Generate JWT token
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Get cookie header string for API routes
export function getSetCookieHeader(token) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

// Set token in cookie - for Server Components only
export async function setTokenCookie(token) {
  try {
    (await cookies()).set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } catch {
    console.error("Failed to set cookie in Server Component context.");
  }
}

// Get token from cookie - for Server Components only
export async function getTokenFromCookie() {
  try {
    return (await cookies()).get(COOKIE_NAME)?.value;
  } catch {
    return null;
  }
}

// Remove token cookie - for Server Components only
export async function removeTokenCookie() {
  try {
    (await cookies()).set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });
  } catch {
    console.error("Failed to remove cookie.");
  }
}

// Get current user from token - for Server Components only
export async function getCurrentUser() {
  const token = await getTokenFromCookie();
  if (!token) return null;
  return verifyToken(token);
}

// Create token payload with important info
export function createTokenPayload(user) {
  return {
    userId: user._id.toString(),
    email: user.email,
    username: user.username,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    institution: user.institution,
    fieldOfResearch: user.fieldOfResearch,
    profilePicture: user.profilePicture || null,
    cloudinaryPublicId: user.cloudinaryPublicId || null,
  };
}