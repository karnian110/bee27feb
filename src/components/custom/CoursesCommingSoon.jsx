import 'server-only'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Clock,
  Construction,
  Bell,
  ArrowRight,
} from "lucide-react";

const courses = [
  {
    title: "Scientific Research Writing",
    description: "Master the art of publishing high-impact papers.",
    duration: "8 weeks",
    level: "Beginner",
  },
  {
    title: "Machine Learning for Researchers",
    description: "Machine Learning fundamentals tailored for academia.",
    duration: "12 weeks",
    level: "Intermediate",
  },
  {
    title: "Deep Learning for Researchers",
    description: "Deep Learning techniques for complex data modeling.",
    duration: "10 weeks",
    level: "Advanced",
  },
  {
    title: "AI Tools for Scholars",
    description: "Leveraging AI tools to accelerate your research workflow.",
    duration: "6 weeks",
    level: "Beginner",
  },
  {
    title: "Data Analysis",
    description: "Advanced statistical methods and visualization.",
    duration: "8 weeks",
    level: "Intermediate",
  },
  {
    title: "Flac 2D/3D",
    description: "Numerical modeling for rock and soil mechanics.",
    duration: "10 weeks",
    level: "Advanced",
  },
  {
    title: "AutoCAD 2D/3D",
    description: "Professional drafting and engineering design.",
    duration: "8 weeks",
    level: "Beginner",
  },
  {
    title: "UDEC",
    description: "Simulating jointed rock masses and structures.",
    duration: "10 weeks",
    level: "Advanced",
  },
];

const getLevelColor = (level) => {
  switch (level) {
    case "Beginner":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Intermediate":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Advanced":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-100";
  }
};

export default function Courses() {
  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1B263B 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#950E1D]/10 border border-[#950E1D]/20 text-[#950E1D] text-sm font-semibold mb-6">
            <Construction className="w-4 h-4" />
            Coming Soon
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-[#950E1D]" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B263B] tracking-tight">
              ScholarBee Academy
            </h2>
          </div>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Comprehensive training designed for scholars. From academic writing to
            advanced numerical modeling and AI applications.
          </p>
        </div>

        {/* Big Coming Soon Banner */}
        <div className="mb-12 p-8 sm:p-12 bg-gradient-to-br from-[#1B263B] via-[#2d3d56] to-[#1B263B] rounded-3xl shadow-xl text-center">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
              <div className="relative p-6 bg-amber-500/10 rounded-3xl border border-amber-500/20">
                <Construction className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400" />
              </div>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Coming Soon
            </h3>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl mb-6">
              We&apos;re building comprehensive courses to help you excel in your research journey. 
              Get notified when we launch!
            </p>
            <Button
              asChild
              className="rounded-xl h-12 px-8 bg-amber-500 hover:bg-amber-400 text-[#1B263B] font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
            >
              <Link href="#notify" className="gap-2">
                <Bell className="w-5 h-5" />
                Notify Me
              </Link>
            </Button>
          </div>
        </div>

        
        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button
            asChild
            variant="orange"
          >
            <Link href="/academy" className="gap-2">
              View All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
