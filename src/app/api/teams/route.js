import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Team from "@/lib/models/Teams";
import User from "@/lib/models/User";

// GET - Get all teams (public access) or user's teams
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const myTeams = searchParams.get("my") === "true";
    
    let query = {};
    
    // If requesting my teams, require authentication
    if (myTeams) {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 }
        );
      }
      // Get teams where user is owner
      query = { owner: currentUser.userId };
    }
    
    const teams = await Team.find(query)
      .populate("owner", "firstName lastName email username profilePicture")
      .populate("members", "firstName lastName email username profilePicture")
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Get teams error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get teams" },
      { status: 500 }
    );
  }
}
