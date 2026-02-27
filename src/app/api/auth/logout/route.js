import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  try {
    // Create response with cleared cookie
    const response = NextResponse.json({
      success: true,
      message: "Logout successful"
    });
    
    // Clear cookie by setting maxAge to 0
    response.headers.set("Set-Cookie", serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/"
    }));
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to logout" },
      { status: 500 }
    );
  }
}
