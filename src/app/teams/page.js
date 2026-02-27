import TeamsList from "@/components/custom/TeamsList";
import Team from '@/lib/models/Teams';
import User from '@/lib/models/User'; // Import User model for collection name
import dbConnect from "@/lib/db";

export default async function Home() {
  try {
    // Ensure database connection is established
    await dbConnect();

    const researchTeams = await Team.aggregate([
      {
        $lookup: {
          from: User.collection.name, // Use dynamic collection name
          localField: "owner",
          foreignField: "_id",
          as: "ownerInfo"
        }
      },
      { $unwind: "$ownerInfo" }, // Assumes owner always exists
      {
        $project: {
          _id: 0, // Exclude the original ObjectId _id
          teamName: 1,
          // Build owner string safely, trimming extra spaces
          owner: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$ownerInfo.title", ""] },
                  " ",
                  { $ifNull: ["$ownerInfo.firstName", ""] },
                  " ",
                  { $ifNull: ["$ownerInfo.lastName", ""] }
                ]
              }
            }
          },
          profilePicture: 1,
          moto: 1,
          about: 1,
          // Convert fieldOfResearch to array if it's a comma-separated string
          fieldOfResearch: {
            $cond: {
              if: { $isArray: "$fieldOfResearch" },
              then: "$fieldOfResearch",
              else: {
                $cond: {
                  if: { $eq: ["$fieldOfResearch", null] },
                  then: [],
                  else: { $split: ["$fieldOfResearch", ", "] }
                }
              }
            }
          },
          memberCount: { $size: { $ifNull: ["$members", []] } },
          papersPublished: { $ifNull: ["$researchProfile.papersPublished", 0] },
          // Use _id as a stable identifier; generate a slug separately if needed
          id: { $toString: "$_id" } // or keep original slug generation with caution
        }
      }
    ]);

    return <TeamsList researchTeams={researchTeams} />;
  } catch (error) {
    console.error("Failed to fetch research teams:", error);
    // Optionally return a fallback UI
    return <div>Unable to load teams. Please try again later.</div>;
  }
}