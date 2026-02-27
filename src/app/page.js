import 'server-only';
import HeroSection from '@/components/custom/HeroSection';
import FeaturedResearcher from '@/components/custom/FeaturedResearcher';
import FeaturedResearch from '@/components/custom/FeaturedResearch';
import CoursesComingSoon from '@/components/custom/CoursesComingSoon'; // Fixed typo
import dbConnect from '@/lib/db';
import Featured from '@/lib/models/Featured';

export default async function Home() {
  try {
    // Connect to database with error handling
    await dbConnect();

    // Use findOne to get the first (and likely only) featured document
    const featuredDoc = await Featured.findOne({}).lean();

    // If no document exists, render without featured sections or show fallback
    if (!featuredDoc) {
      console.warn('No featured document found in database');
      return (
        <>
          <HeroSection />
          {/* Optionally show empty states or skeletons */}
          <CoursesComingSoon />
        </>
      );
    }

    // Safely extract and serialize data, providing defaults if missing
    const researcher = featuredDoc.researcher 
      ? JSON.parse(JSON.stringify(featuredDoc.researcher))
      : null;

    const featuredResearchPapers = featuredDoc.papers 
      ? JSON.parse(JSON.stringify(featuredDoc.papers))
      : [];

    return (
      <>
        <HeroSection />
        {researcher && <FeaturedResearcher researcher={researcher} />}
        {featuredResearchPapers.length > 0 && (
          <FeaturedResearch featuredResearchPapers={featuredResearchPapers} />
        )}
        <CoursesComingSoon />
      </>
    );
  } catch (error) {
    // Log the error for debugging (consider using a logging service)
    console.error('Failed to load homepage data:', error);

    // Render a fallback UI (or you could rethrow to show an error boundary)
    return (
      <>
        <HeroSection />
        <CoursesComingSoon />
        {/* Optionally show an error message to admins only */}
      </>
    );
  }
}