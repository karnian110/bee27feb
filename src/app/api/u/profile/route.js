import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

// GET - Get current user profile
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
    
    const user = await User.findById(currentUser.userId).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Convert to plain object to ensure all fields are included
    const userObject = user.toObject();
    
    console.log("Profile fetched:", {
      userId: userObject._id,
      profilePicture: userObject.profilePicture,
      cloudinaryPublicId: userObject.cloudinaryPublicId
    });
    
    return NextResponse.json({ user: userObject });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT - Update current user profile
export async function PUT(request) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const updateData = await request.json();
    
    // Prevent changing email and role
    delete updateData.email;
    delete updateData.role;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;
    
    console.log("Updating profile with data:", {
      userId: currentUser.userId,
      profilePicture: updateData.profilePicture,
      cloudinaryPublicId: updateData.cloudinaryPublicId
    });
    
    // Check username uniqueness if changing
    if (updateData.username && updateData.username !== currentUser.username) {
      const existingUser = await User.findOne({
        username: updateData.username.toLowerCase(),
        _id: { $ne: currentUser.userId }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
    }
    
    // Use findById and save to avoid validation issues
    const user = await User.findById(currentUser.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Update all fields
    Object.assign(user, updateData);
    
    // Save the document
    const updatedUser = await user.save();
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Convert to plain object to ensure all fields are included
    const userObject = updatedUser.toObject();
    
    // Remove password from response
    delete userObject.password;
    
    console.log("Profile updated:", {
      userId: userObject._id,
      profilePicture: userObject.profilePicture,
      cloudinaryPublicId: userObject.cloudinaryPublicId
    });
    
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: userObject
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
