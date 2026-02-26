import HeroSection from "@/components/custom/HeroSection";
import FeaturedResearcher from "@/components/custom/FeaturedResearcher";
import FeaturedResearch from "@/components/custom/FeaturedResearch";
import CoursesCommingSoon from "@/components/custom/CoursesCommingSoon";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedResearcher/>
      <FeaturedResearch/>
      <CoursesCommingSoon/>
    </>
  );
}
