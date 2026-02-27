import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import cookie from "cookie"; // Import the cookie package
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken, createTokenPayload } from "@/lib/auth";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

export async function POST(request) {
  try {
    // Check rate limit for login attempts
    const rateLimitResult = checkRateLimit(request, "login");
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }
    
    await dbConnect();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user (case-insensitive email)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create JWT payload and token
    const tokenPayload = createTokenPayload(user);
    const token = generateToken(tokenPayload);

    // Cookie options
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,        // Prevents client-side JS access
      secure: isProduction,  // Send only over HTTPS in production
      sameSite: "lax",       // Protects against CSRF
      path: "/",             // Available on all routes
      maxAge: 60 * 60 * 24 * 7, // 7 days (in seconds) – adjust as needed
    };

    // Serialize the cookie
    const cookieString = cookie.serialize("token", token, cookieOptions);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: tokenPayload,
    });

    // Set the cookie header
    response.headers.set("Set-Cookie", cookieString);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to login" },
      { status: 500 }
    );
  }
}