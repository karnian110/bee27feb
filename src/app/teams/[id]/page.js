import 'server-only';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Team from '@/lib/models/Teams';
import TeamDetails from '@/components/custom/TeamDetails'; // adjust the import path as needed

export default async function ScholarProfilePage({ params }) {
  try {
    // Safely extract the id – works in both Next.js 15 (params is a promise) and older versions
    const { id } = await params;

    // If no id is provided, show 404
    if (!id) {
      return notFound();
    }

    await dbConnect();

    // Fetch team with populated references
    const team = await Team.findById(id)
      .populate('owner', 'firstName lastName email')
      .populate('members', 'firstName lastName email title createdAt')
      .lean()
      .exec();

    // If team not found, show 404
    if (!team) {
      return notFound();
    }

    // Transform data with safe defaults for optional or missing fields
    const formattedTeam = {
      teamName: team.teamName ?? '',
      email: team.email ?? '',
      owner: team.owner
        ? {
            userId: team.owner._id.toString(),
            firstName: team.owner.firstName ?? '',
            lastName: team.owner.lastName ?? '',
            email: team.owner.email ?? '',
          }
        : null, // fallback in case owner is missing
      profilePicture: team.profilePicture ?? null,
      members: (team.members ?? []).map((member) => ({
        firstName: member.firstName ?? '',
        lastName: member.lastName ?? '',
        email: member.email ?? '',
        role: member.title ?? '', // using user's title as team role
        joinedAt: member.createdAt ? new Date(member.createdAt).toISOString() : new Date().toISOString(),
      })),
      about: team.about ?? '',
      fieldOfResearch: team.fieldOfResearch ?? '',
      researchProfile: team.researchProfile ?? null,
      papers: team.papers ?? [],
      expertise: team.expertise ?? [],
      achievements: team.achievements ?? [],
      researchOutlook: team.researchOutlook ?? null,
      contact: team.contact ?? null,
    };

    return <TeamDetails user={formattedTeam} />;
  } catch (error) {
    console.error('Failed to load scholar profile:', error);
    // You can optionally render a custom error UI here
    throw new Error('Failed to load scholar profile');
  }
}