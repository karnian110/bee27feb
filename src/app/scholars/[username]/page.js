import ResearcherProfile from "@/components/custom/Researcher";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";


export default async function ScholarProfilePage({ params }) {
  const { username } = await params;
  await dbConnect();
  const user = await User.findOne({
    username
  }).lean();

  return (
    <>
      <ResearcherProfile user={JSON.parse(JSON.stringify(user))} />
    </>
  );
}