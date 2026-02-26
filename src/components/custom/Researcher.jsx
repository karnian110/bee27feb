"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Link2,
  BarChart3,
  TrendingUp,
  Award,
  Building2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  Sparkles,
  Calendar,
  BookOpen,
  Trophy,
  Globe,
  Linkedin,
  Facebook,
  Twitter,
  ScrollText,
  User,
  Target,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// Tab Navigation Component
const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "publications", label: "Publications", icon: BookOpen },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "expertise", label: "Expertise", icon: Target },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "profiles", label: "Profiles", icon: Globe },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <div className="relative w-full">
      {/* Left Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      
      {/* Right Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Tabs Container */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1 px-1 scroll-smooth">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                isActive
                  ? "text-white"
                  : "text-slate-600 hover:text-[#950E1D] hover:bg-[#950E1D]/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeProfileTabBg"
                  className="absolute inset-0 bg-[#950E1D] rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">
                <Icon className={`w-4 h-4 ${isActive ? "scale-110" : ""}`} />
              </span>
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default function ResearcherProfile({ user }) {
  const [activeTab, setActiveTab] = useState("education");
  const researchProfile = user?.researchProfile || {};

  const metrics = [
    { icon: FileText, label: "Papers", value: researchProfile.papersPublished ?? 0 },
    { icon: Calendar, label: "Under Review", value: researchProfile.underReview ?? 0 },
    { icon: Link2, label: "Citations", value: researchProfile.citations ?? 0 },
    { icon: BarChart3, label: "h-index", value: researchProfile.hIndex ?? 0 },
    { icon: TrendingUp, label: "i10-index", value: researchProfile.i10Index ?? 0 },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  // Education Section Content
  const EducationContent = () => (
    <motion.div
      key="education"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-[#950E1D]/10 rounded-xl">
          <GraduationCap className="w-5 h-5 text-[#950E1D]" />
        </div>
        <h2 className="text-xl font-bold text-[#1B263B]">Education</h2>
      </div>
      <div className="space-y-4">
        {(user.education || []).map((edu, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-2xl p-5 lg:p-6 shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-md hover:border-[#950E1D]/20 transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <h3 className="font-semibold text-[#1B263B] text-base lg:text-lg">
                {edu.degree}
              </h3>
              <span className={`px-3 py-1 text-xs rounded-full font-medium w-fit ${
                edu.ongoing 
                  ? "bg-green-50 text-green-700 border border-green-100" 
                  : "bg-slate-50 text-slate-600 border border-slate-100"
              }`}>
                {edu.ongoing ? "Ongoing" : "Completed"}
              </span>
            </div>
            <div className="text-[#950E1D] font-medium text-sm lg:text-base mb-3">
              {edu.institution}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(edu.started)} - {formatDate(edu.completed)}
              </span>
              {edu.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {edu.location}
                </span>
              )}
            </div>
            {edu.result && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-sm text-slate-600">
                  <span className="font-medium">Result:</span> {edu.result}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Publications Section Content
  const PublicationsContent = () => (
    <motion.div
      key="publications"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-[#950E1D]/10 rounded-xl">
          <BookOpen className="w-5 h-5 text-[#950E1D]" />
        </div>
        <h2 className="text-xl font-bold text-[#1B263B]">Publications</h2>
      </div>
      <div className="space-y-4">
        {(user.papers || []).map((paper, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-2xl p-5 lg:p-6 shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-md hover:border-[#950E1D]/20 transition-all duration-300"
          >
            <h3 className="text-base lg:text-lg font-semibold text-[#1B263B] group-hover:text-[#950E1D] transition-colors mb-2">
              {paper.title}
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              {paper.journalName} · Vol. {paper.volume} · {paper.year}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {paper.summary}
            </p>
            {paper.highlights && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                  {paper.highlights}
                </span>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">
                Citations: <span className="font-semibold text-[#1B263B]">{paper.citations}</span>
              </span>
              <div className="flex items-center gap-3">
                {paper.doi && (
                  <span className="text-xs text-slate-400">DOI: {paper.doi}</span>
                )}
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-[#950E1D] hover:text-[#950E1D] hover:bg-[#950E1D]/5 gap-1 h-7 text-xs px-2"
                >
                  <Link href={paper.fullPaperLink} target="_blank">
                    Full paper
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Experience Section Content
  const ExperienceContent = () => (
    <motion.div
      key="experience"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-[#950E1D]/10 rounded-xl">
          <Briefcase className="w-5 h-5 text-[#950E1D]" />
        </div>
        <h2 className="text-xl font-bold text-[#1B263B]">Professional Experience</h2>
      </div>
      <div className="space-y-4">
        {(user.professionalExperience || []).map((job, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-2xl p-5 lg:p-6 shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <h3 className="font-semibold text-[#1B263B] text-base lg:text-lg">
                {job.jobTitle}
              </h3>
              <span className={`px-3 py-1 text-xs rounded-full font-medium w-fit ${
                job.ongoing 
                  ? "bg-green-50 text-green-700 border border-green-100" 
                  : "bg-slate-50 text-slate-600 border border-slate-100"
              }`}>
                {job.ongoing ? "Current" : "Past"}
              </span>
            </div>
            <div className="text-[#950E1D] font-medium text-sm lg:text-base mb-3">
              {job.organization}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(job.startDate)} - {formatDate(job.endDate)}
              </span>
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              {job.briefDescription}
            </p>
            {job.contributions && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 uppercase tracking-wide">Key Contributions</span>
                <p className="text-sm text-slate-600 mt-1">{job.contributions}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Expertise Section Content
  const ExpertiseContent = () => (
    <motion.div
      key="expertise"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-[#950E1D]/10 rounded-xl">
          <Target className="w-5 h-5 text-[#950E1D]" />
        </div>
        <h2 className="text-xl font-bold text-[#1B263B]">Expertise</h2>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm shadow-slate-200/50 border border-slate-100"
      >
        <div className="flex flex-wrap gap-3">
          {(user.expertise || []).map((item) => (
            <motion.span
              key={item}
              variants={itemVariants}
              className="px-5 py-2.5 text-sm font-medium rounded-full bg-[#950E1D]/5 text-[#950E1D] border border-[#950E1D]/10 hover:bg-[#950E1D]/10 transition-colors cursor-default"
            >
              {item}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // Achievements Section Content
  const AchievementsContent = () => (
    <motion.div
      key="achievements"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-[#950E1D]/10 rounded-xl">
          <Trophy className="w-5 h-5 text-[#950E1D]" />
        </div>
        <h2 className="text-xl font-bold text-[#1B263B]">Achievements & Awards</h2>
      </div>
      <div className="space-y-4">
        {(user.achievements || []).map((achievement, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-2xl p-5 lg:p-6 shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 rounded-xl flex-shrink-0">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1B263B] text-base lg:text-lg mb-1">
                  {achievement.name}
                </h3>
                <p className="text-sm text-[#950E1D] font-medium mb-3">
                  {achievement.issuingOrganization}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {achievement.description}
                </p>
                {achievement.links && achievement.links.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {achievement.links.map((link, linkIdx) => (
                      <a
                        key={linkIdx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[#950E1D]/5 text-[#950E1D] hover:bg-[#950E1D]/10 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Link {achievement.links.length > 1 ? linkIdx + 1 : ""}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  // Profiles Section Content
  const ProfilesContent = () => (
    <motion.div
      key="profiles"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-[#950E1D]/10 rounded-xl">
          <Globe className="w-5 h-5 text-[#950E1D]" />
        </div>
        <h2 className="text-xl font-bold text-[#1B263B]">Research Profiles</h2>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid sm:grid-cols-2 gap-4"
      >
        {user.researchOutlook?.googleScholarProfile && (
          <motion.a
            variants={itemVariants}
            href={user.researchOutlook.googleScholarProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <ScrollText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[#1B263B] group-hover:text-blue-600 transition-colors">
                Google Scholar
              </div>
              <div className="text-xs text-slate-500">View publications & citations</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </motion.a>
        )}
        {user.researchOutlook?.researchGateProfile && (
          <motion.a
            variants={itemVariants}
            href={user.researchOutlook.researchGateProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-md hover:border-green-200 transition-all"
          >
            <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[#1B263B] group-hover:text-green-600 transition-colors">
                ResearchGate
              </div>
              <div className="text-xs text-slate-500">Connect and collaborate</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors" />
          </motion.a>
        )}
        {user.researchOutlook?.orcid && (
          <motion.a
            variants={itemVariants}
            href={`https://orcid.org/${user.researchOutlook.orcid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all"
          >
            <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[#1B263B] group-hover:text-emerald-600 transition-colors">
                ORCID
              </div>
              <div className="text-xs text-slate-500 truncate">{user.researchOutlook.orcid}</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
          </motion.a>
        )}
        {user.researchOutlook?.linkedInProfile && (
          <motion.a
            variants={itemVariants}
            href={user.researchOutlook.linkedInProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <Linkedin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[#1B263B] group-hover:text-blue-600 transition-colors">
                LinkedIn
              </div>
              <div className="text-xs text-slate-500">Professional network</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  );

  // Contact Section Content
  const ContactContent = () => (
    <motion.div
      key="contact"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-[#950E1D]/10 rounded-xl">
          <Mail className="w-5 h-5 text-[#950E1D]" />
        </div>
        <h2 className="text-xl font-bold text-[#1B263B]">Contact</h2>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl p-6 shadow-sm shadow-slate-200/50 border border-slate-100"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {user.contact?.email && (
            <motion.a
              variants={itemVariants}
              href={`mailto:${user.contact.email}`}
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="p-2.5 bg-[#950E1D]/10 rounded-xl">
                <Mail className="w-5 h-5 text-[#950E1D]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-400 uppercase tracking-wide">Email</div>
                <div className="text-sm font-medium text-[#1B263B] group-hover:text-[#950E1D] transition-colors truncate">
                  {user.contact.email}
                </div>
              </div>
            </motion.a>
          )}
          {user.contact?.phone && (
            <motion.a
              variants={itemVariants}
              href={`tel:${user.contact.phone}`}
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="p-2.5 bg-[#950E1D]/10 rounded-xl">
                <Phone className="w-5 h-5 text-[#950E1D]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Phone</div>
                <div className="text-sm font-medium text-[#1B263B] group-hover:text-[#950E1D] transition-colors">
                  {user.contact.phone}
                </div>
              </div>
            </motion.a>
          )}
          {user.contact?.officeLocation && (
            <motion.div
              variants={itemVariants}
              className="flex items-start gap-3 p-4 rounded-xl sm:col-span-2 lg:col-span-1"
            >
              <div className="p-2.5 bg-[#950E1D]/10 rounded-xl">
                <MapPin className="w-5 h-5 text-[#950E1D]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-400 uppercase tracking-wide">Office</div>
                <div className="text-sm font-medium text-[#1B263B]">
                  {user.contact.officeLocation}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Social Links */}
        {(user.contact?.facebook || user.contact?.twitter || user.contact?.linkedIn) && (
          <div className="pt-6 border-t border-slate-100">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-4">Social Media</div>
            <div className="flex flex-wrap gap-3">
              {user.contact?.facebook && (
                <motion.a
                  variants={itemVariants}
                  href={user.contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </motion.a>
              )}
              {user.contact?.twitter && (
                <motion.a
                  variants={itemVariants}
                  href={user.contact.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </motion.a>
              )}
              {user.contact?.linkedIn && (
                <motion.a
                  variants={itemVariants}
                  href={user.contact.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </motion.a>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  // Render active tab content
  const renderContent = () => {
    switch (activeTab) {
      case "education":
        return <EducationContent />;
      case "publications":
        return <PublicationsContent />;
      case "experience":
        return <ExperienceContent />;
      case "expertise":
        return <ExpertiseContent />;
      case "achievements":
        return <AchievementsContent />;
      case "profiles":
        return <ProfilesContent />;
      case "contact":
        return <ContactContent />;
      default:
        return <EducationContent />;
    }
  };

  return (
    <section className="relative py-6 lg:py-12 bg-gradient-to-b from-slate-50 to-white min-h-screen overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1B263B 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Button
            asChild
            variant="ghost"
            className="text-slate-500 hover:text-[#950E1D] hover:bg-[#950E1D]/5 -ml-2 text-sm"
          >
            <Link href="/scholars" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Researchers
            </Link>
          </Button>
        </motion.div>

        {/* Profile Header Card with Left Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl lg:rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden mb-6"
        >
          {/* Top Accent Bar */}
          <div className="h-1.5 bg-gradient-to-r from-[#950E1D] via-[#B01124] to-[#950E1D]" />

          <div className="flex flex-col lg:flex-row">
            {/* Left: Full Researcher Image */}
            <div className="relative w-full lg:w-80 xl:w-96 flex-shrink-0">
              <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] xl:h-[560px]">
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt={`${user.firstName || ""} ${user.lastName || ""}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 384px"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1B263B] to-[#2d3d5c]">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-10 h-10 text-white/60" />
                      </div>
                      <span className="text-white/60 text-lg font-medium">
                        {user.firstName || "Researcher"}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
                
                {/* Researcher Badge */}
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#950E1D] text-white rounded-xl text-xs font-semibold shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    Researcher
                  </div>
                </div>

                {/* Name Card at Bottom */}
                <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6">
                  <div className="p-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg">
                    <h1 className="text-xl lg:text-2xl font-bold text-[#1B263B] mb-1">
                      {user.firstName} {user.lastName}
                    </h1>
                    {user.fieldOfResearch && (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-100">
                        {user.fieldOfResearch}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Profile Info */}
            <div className="flex-1 p-5 lg:p-8">
              {/* Badge */}
              <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#950E1D]/5 border border-[#950E1D]/10 text-[#950E1D] text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" />
                Researcher Profile
              </div>

              {/* Institution */}
              {user.institution && (
                <div className="flex items-center gap-2 text-slate-500 mb-4">
                  <Building2 className="w-4 h-4 text-[#950E1D]" />
                  <span className="text-sm">{user.institution}</span>
                </div>
              )}

              {/* Bio */}
              <p className="text-slate-600 leading-relaxed text-sm lg:text-base mb-6">
                {user.bio}
              </p>

              {/* Quick Contact */}
              {user.contact?.email && (
                <div className="flex items-center gap-2 mb-6">
                  <Mail className="w-4 h-4 text-[#950E1D]" />
                  <a
                    href={`mailto:${user.contact.email}`}
                    className="text-sm text-slate-600 hover:text-[#950E1D] transition-colors"
                  >
                    {user.contact.email}
                  </a>
                </div>
              )}

              {/* Metrics Grid - Inside Card */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
              >
                {metrics.map((metric, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="group bg-slate-50 rounded-xl p-3 border border-slate-100 text-center hover:bg-white hover:shadow-sm hover:border-[#950E1D]/20 transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center p-1.5 bg-[#950E1D]/10 rounded-lg mb-1.5 group-hover:bg-[#950E1D]/20 transition-colors">
                      <metric.icon className="w-3.5 h-3.5 text-[#950E1D]" />
                    </div>
                    <div className="text-lg font-bold text-[#1B263B] mb-0.5">
                      {metric.value}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                      {metric.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="sticky top-4 z-30 mb-6"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100/80 p-2">
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <div key={activeTab} className="min-h-[400px]">
            {renderContent()}
          </div>
        </AnimatePresence>
      </div>
    </section>
  );
}
