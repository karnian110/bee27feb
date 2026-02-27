import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Featured from "@/lib/models/Featured";

// GET - Fetch the featured document (admin and moderator only)
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "moderator")) {
      return NextResponse.json(
        { error: "Forbidden - Admin or Moderator access required" },
        { status: 403 }
      );
    }
    
    await dbConnect();
    
    let featured = await Featured.findOne();
    
    if (!featured) {
      return NextResponse.json({
        researcher: {
          name: "",
          profilePicture: "",
          cloudinaryPublicId: "",
          title: "",
          institution: "",
          bio: "",
          fieldOfResearch: [],
          expertise: [],
          papersPublished: 0,
          citations: 0,
          hIndex: 0,
          i10Index: 0
        },
        papers: []
      });
    }
    
    return NextResponse.json(featured);
  } catch (error) {
    console.error("Get featured error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch featured" },
      { status: 500 }
    );
  }
}

// PUT - Update or create the featured document (admin and moderator only)
export async function PUT(request) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "moderator")) {
      return NextResponse.json(
        { error: "Forbidden - Admin or Moderator access required" },
        { status: 403 }
      );
    }
    
    await dbConnect();
    
    const data = await request.json();
    
    let featured = await Featured.findOne();
    
    if (featured) {
      featured.researcher = data.researcher;
      featured.papers = data.papers;
      await featured.save();
    } else {
      featured = await Featured.create({
        researcher: data.researcher,
        papers: data.papers
      });
    }
    
    return NextResponse.json(featured);
  } catch (error) {
    console.error("Update featured error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update featured" },
      { status: 500 }
    );
  }
}
