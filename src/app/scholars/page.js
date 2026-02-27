import ScholarsList from "@/components/custom/ScholarList";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db";

export const revalidate = 120; 

export default async function Home() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch users with lean() and exec() for plain objects and better stack traces
    const users = await User.find({}).lean().exec();

    // Transform each user safely
    const researchers = users.map((user) => ({
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed',
      profilePicture: user.profilePicture || 'https://www.gravatar.com/avatar/?d=mp&f=y&r=pg&s=200&format=png',
      title: user.title || '',
      institution: user.institution || '',
      location: user.location || '',
      bio: user.bio || '',
      // If fieldOfResearch is a string, wrap it in an array.
      // If it's already an array, keep it as is.
      fieldOfResearch: user.fieldOfResearch
        ? Array.isArray(user.fieldOfResearch)
          ? user.fieldOfResearch
          : [user.fieldOfResearch]
        : [],
      papersPublished: user.researchProfile?.papersPublished || 0,
      citations: user.researchProfile?.citations || 0,
      hIndex: user.researchProfile?.hIndex || 0,
      username: user.username || '',
    }));

    // Render the scholars list
    
    return <ScholarsList researchers={JSON.parse(JSON.stringify(researchers))} />;
  } catch (error) {
    // Log the error on the server (optional)
    console.error('Failed to load researchers:', error);

    // Show a user-friendly fallback UI
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Researchers</h2>
        <p className="text-gray-600 mt-2">Please try again later.</p>
      </div>
    );
  }
}