import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

// GET - Search users by name, email, or username (authenticated users only)
export async function GET(request) {
  try {
    // Check rate limit for search
    const rateLimitResult = checkRateLimit(request, "search");
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    // Verify authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] });
    }

    // Search by firstName, lastName, email, or username (case-insensitive)
    const searchRegex = new RegExp(query, "i");

    const users = await User.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { username: searchRegex },
      ],
    }, {
      password: 0, // Exclude password
      __v: 0,
    }).limit(10); // Limit to 10 results

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Search users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search users" },
      { status: 500 }
    );
  }
}
