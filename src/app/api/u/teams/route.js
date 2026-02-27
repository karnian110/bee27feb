import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Team from "@/lib/models/Teams";
import User from "@/lib/models/User";

// POST - Create new team (authenticated users only)
export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const data = await request.json();
    
    if (!data.teamName) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }
    
    // Only admins can assign a different owner
    let ownerId = currentUser.userId;
    if (data.owner && data.owner !== currentUser.userId) {
      if (currentUser.role !== "admin") {
        return NextResponse.json(
          { error: "Only admins can assign different owners" },
          { status: 403 }
        );
      }
      ownerId = data.owner;
      
      // Verify the specified owner exists
      const ownerExists = await User.findById(ownerId);
      if (!ownerExists) {
        return NextResponse.json(
          { error: "Owner user not found" },
          { status: 404 }
        );
      }
    }
    
    // Check team name uniqueness
    const existingTeam = await Team.findOne({
      teamName: { $regex: new RegExp(`^${data.teamName}$`, "i") }
    });
    
    if (existingTeam) {
      return NextResponse.json(
        { error: "Team name already exists" },
        { status: 409 }
      );
    }
    
    const team = await Team.create({
      teamName: data.teamName,
      owner: ownerId,
      members: data.members || [],
      email: data.email,
      profilePicture: data.profilePicture,
      about: data.about,
      fieldOfResearch: data.fieldOfResearch,
      expertise: data.expertise || [],
      researchProfile: data.researchProfile || {},
      papers: data.papers || [],
      achievements: data.achievements || [],
      researchOutlook: data.researchOutlook || {},
      contact: data.contact || {}
    });
    
    await team.populate("owner", "firstName lastName email username");
    await team.populate("members", "firstName lastName email username");
    
    return NextResponse.json({
      success: true,
      message: "Team created successfully",
      team
    }, { status: 201 });
  } catch (error) {
    console.error("Create team error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create team" },
      { status: 500 }
    );
  }
}
