import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Get full user data (without password)
    const user = await User.findById(currentUser.userId).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Merge currentUser (from JWT) with fresh DB data
    // currentUser takes precedence for security-critical fields
    const userObject = user.toObject();
    delete userObject.password; // Ensure password is never returned
    
    return NextResponse.json({
      user: {
        ...userObject,
        userId: currentUser.userId, // Ensure ID matches token
        email: currentUser.email,   // Ensure email matches token
        role: currentUser.role,     // Ensure role matches token
      }
    });
    
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get user" },
      { status: 500 }
    );
  }
}
