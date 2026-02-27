import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Team from "@/lib/models/Teams";
import User from "@/lib/models/User";
import { deleteImage } from "@/lib/cloudinary";

// Helper function to check if user is team owner
async function isTeamOwner(teamId, userId) {
  const team = await Team.findById(teamId);
  if (!team) return { isOwner: false, team: null, error: "Team not found" };
  
  const isOwner = team.owner.toString() === userId;
  return { isOwner, team, error: isOwner ? null : "Only team owner can perform this action" };
}

// GET - Get single team by ID (public access)
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    const team = await Team.findById(id)
      .populate("owner", "firstName lastName email username profilePicture title institution")
      .populate("members", "firstName lastName email username profilePicture title");
    
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ team });
  } catch (error) {
    console.error("Get team error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get team" },
      { status: 500 }
    );
  }
}

// PUT - Update team (owner only)
export async function PUT(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const { id } = await params;
    
    // Check if user is team owner
    const { isOwner, team, error } = await isTeamOwner(id, currentUser.userId);
    
    if (!isOwner) {
      return NextResponse.json(
        { error },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Fields that can be updated
    const allowedFields = [
      "teamName",
      "moto",
      "email",
      "profilePicture",
      "cloudinaryPublicId",
      "about",
      "fieldOfResearch",
      "researchProfile",
      "papers",
      "expertise",
      "achievements",
      "researchOutlook",
      "contact",
      "members"
    ];
    
    // Build update object
    const updateData = {};
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });
    
    // Check team name uniqueness if being updated
    if (data.teamName && data.teamName !== team.teamName) {
      const existingTeam = await Team.findOne({
        _id: { $ne: id },
        teamName: { $regex: new RegExp(`^${data.teamName}$`, "i") }
      });
      
      if (existingTeam) {
        return NextResponse.json(
          { error: "Team name already exists" },
          { status: 409 }
        );
      }
    }
    
    // Update the team
    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("owner", "firstName lastName email username profilePicture")
      .populate("members", "firstName lastName email username profilePicture");
    
    return NextResponse.json({
      success: true,
      message: "Team updated successfully",
      team: updatedTeam
    });
  } catch (error) {
    console.error("Update team error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update team" },
      { status: 500 }
    );
  }
}

// DELETE - Delete team (owner only)
export async function DELETE(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const { id } = await params;
    
    // Check if user is team owner
    const { isOwner, team, error } = await isTeamOwner(id, currentUser.userId);
    
    if (!isOwner) {
      return NextResponse.json(
        { error },
        { status: 403 }
      );
    }
    
    // Delete team image from Cloudinary if exists
    if (team.cloudinaryPublicId) {
      await deleteImage(team.cloudinaryPublicId);
    }
    
    // Delete the team
    await Team.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: "Team deleted successfully"
    });
  } catch (error) {
    console.error("Delete team error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete team" },
      { status: 500 }
    );
  }
}
