import 'server-only'
import HeroSection from "@/components/custom/HeroSection";
import FeaturedResearcher from "@/components/custom/FeaturedResearcher";
import FeaturedResearch from "@/components/custom/FeaturedResearch";
import CoursesCommingSoon from "@/components/custom/CoursesCommingSoon";
import dbConnect from '@/lib/db';


export default async function Home() {
 

  const featuredResearchPapers = [
    {
      title: "AI-Driven Urban Flood Prediction Models",
      authors: ["Dr. Alex Johnson", "Dr. Jane Smith"],
      journalName: "Journal of Environmental Modeling",
      year: 2023,
      highlights:
        "Introduces a novel ML-based model to predict urban flooding with 90% accuracy.",
      doi: "10.1234/jem.2023.001",
      fullPaperLink: "https://example.com/fullpaper1.pdf",
      citations: 120,
    },
    {
      title: "Sustainable Smart Cities: A GIS Approach",
      authors: ["Dr. Jane Smith", "Dr. Michael Lee"],
      journalName: "International Journal of Urban Planning",
      year: 2022,
      highlights:
        "Demonstrates GIS-driven planning for optimizing green spaces and infrastructure resilience.",
      doi: "10.5678/ijup.2022.045",
      fullPaperLink: "https://example.com/fullpaper2.pdf",
      citations: 95,
    },
    {
      title: "Climate Adaptation Strategies for Coastal Cities",
      authors: ["Dr. Emily Wong", "Dr. Alex Johnson"],
      journalName: "Climate Resilience Journal",
      year: 2021,
      highlights:
        "Proposes actionable strategies for coastal cities to adapt to rising sea levels and extreme weather.",
      doi: "10.9012/crj.2021.078",
      fullPaperLink: "https://example.com/fullpaper3.pdf",
      citations: 150,
    },
  ];



  const researcher = {
    name: "Dr. Alex Johnson",
    profilePicture: "https://via.placeholder.com/150",
    title: "Associate Professor",
    institution: "International Tech University",
    bio: "Dr. Alex Johnson focuses on AI-driven environmental solutions and smart city planning. Their research explores predictive modeling for sustainable urban development.",
    fieldOfResearch: ["Environmental Science", "Smart Cities", "Urban Analytics"],
    expertise: ["Machine Learning", "GIS", "Climate Modeling"],
    papersPublished: 32,
    citations: 890,
    hIndex: 15,
    i10Index: 20,
  };




  return (
    <>
      <HeroSection />
      <FeaturedResearcher researcher={researcher} />
      <FeaturedResearch featuredResearchPapers={featuredResearchPapers} />
      <CoursesCommingSoon />
    </>
  );
}
