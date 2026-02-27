"use client";

import React, { useState, useEffect } from "react";
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
  Users,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
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
  Building2,
  Crown,
  UserPlus,
  Edit,
  Settings,
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
const TeamTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "publications", label: "Publications", icon: BookOpen },
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
                  layoutId="activeTeamTabBg"
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

export default function TeamDetails({ user: team }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const researchProfile = team?.researchProfile || {};

  // Check if current user is the team owner
  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
          // Check if current user is the team owner
          if (data.user && team?.owner?.userId) {
            setIsOwner(data.user.userId === team.owner.userId);
          } else if (data.user && team?.owner?._id) {
            setIsOwner(data.user.userId === team.owner._id.toString());
          }
        }
      } catch (error) {
        console.error("Error checking ownership:", error);
      }
    };
    checkOwnership();
  }, [team]);

  const metrics = [
    { icon: Users, label: "Members", value: (team.members || []).length + 1 },
    { icon: FileText, label: "Papers", value: researchProfile.papersPublished ?? 0 },
    { icon: Calendar, label: "Under Review", value: researchProfile.underReview ?? 0 },
    { icon: Link2, label: "Citations", value: researchProfile.citations ?? 0 },
    { icon: BarChart3, label: "h-index", value: researchProfile.hIndex ?? 0 },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  // Overview Section Content
  const OverviewContent = () => (
    <motion.div
      key="overview"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* About Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#950E1D]/10 rounded-xl">
            <Building2 className="w-5 h-5 text-[#950E1D]" />
          </div>
          <h2 className="text-xl font-bold text-[#1B263B]">About</h2>
        </div>
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 shadow-sm shadow-slate-200/50 border border-slate-100"
        >
          <p className="text-slate-600 leading-relaxed">{team.about}</p>
        </motion.div>
      </div>

      {/* Team Owner */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#950E1D]/10 rounded-xl">
            <Crown className="w-5 h-5 text-[#950E1D]" />
          </div>
          <h2 className="text-xl font-bold text-[#1B263B]">Team Lead</h2>
        </div>
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl">
              {team.owner?.firstName?.[0]}{team.owner?.lastName?.[0]}
            </div>
            <div>
              <h3 className="font-semibold text-[#1B263B] text-lg">
                {team.owner?.firstName} {team.owner?.lastName}
              </h3>
              <p className="text-sm text-[#950E1D]">Principal Investigator</p>
              <a 
                href={`mailto:${team.owner?.email}`}
                className="text-xs text-slate-500 hover:text-[#950E1D] transition-colors"
              >
                {team.owner?.email}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Team Members */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-[#950E1D]/10 rounded-xl">
            <UserPlus className="w-5 h-5 text-[#950E1D]" />
          </div>
          <h2 className="text-xl font-bold text-[#1B263B]">Team Members</h2>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 gap-4"
        >
          {(team.members || []).map((member, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-md hover:border-[#950E1D]/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1B263B] to-[#2d3d5c] flex items-center justify-center text-white font-semibold">
                  {member.firstName?.[0]}{member.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1B263B]">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-sm text-[#950E1D] mb-1">{member.role}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    Joined {formatDate(member.joinedAt)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
        {(team.papers || []).map((paper, idx) => (
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
            <p className="text-sm text-slate-500 mb-2">
              {paper.authors?.join(", ")}
            </p>
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
                  className="text-[#950E1D] hover:text-[#950E1D] hover:bg-[#950E1D]/5 gap-1.5"
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
        <h2 className="text-xl font-bold text-[#1B263B]">Research Expertise</h2>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm shadow-slate-200/50 border border-slate-100"
      >
        <div className="flex flex-wrap gap-3">
          {(team.expertise || []).map((item) => (
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
        {(team.achievements || []).map((achievement, idx) => (
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
        {team.researchOutlook?.googleScholarProfile && (
          <motion.a
            variants={itemVariants}
            href={team.researchOutlook.googleScholarProfile}
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
        {team.researchOutlook?.researchGateProfile && (
          <motion.a
            variants={itemVariants}
            href={team.researchOutlook.researchGateProfile}
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
        {team.researchOutlook?.orcid && (
          <motion.a
            variants={itemVariants}
            href={`https://orcid.org/${team.researchOutlook.orcid}`}
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
              <div className="text-xs text-slate-500 truncate">{team.researchOutlook.orcid}</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
          </motion.a>
        )}
        {team.researchOutlook?.linkedInProfile && (
          <motion.a
            variants={itemVariants}
            href={team.researchOutlook.linkedInProfile}
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
        <h2 className="text-xl font-bold text-[#1B263B]">Contact Information</h2>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl p-6 shadow-sm shadow-slate-200/50 border border-slate-100"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {team.contact?.email && (
            <motion.a
              variants={itemVariants}
              href={`mailto:${team.contact.email}`}
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="p-2.5 bg-[#950E1D]/10 rounded-xl">
                <Mail className="w-5 h-5 text-[#950E1D]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-400 uppercase tracking-wide">Email</div>
                <div className="text-sm font-medium text-[#1B263B] group-hover:text-[#950E1D] transition-colors truncate">
                  {team.contact.email}
                </div>
              </div>
            </motion.a>
          )}
          {team.contact?.phone && (
            <motion.a
              variants={itemVariants}
              href={`tel:${team.contact.phone}`}
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="p-2.5 bg-[#950E1D]/10 rounded-xl">
                <Phone className="w-5 h-5 text-[#950E1D]" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Phone</div>
                <div className="text-sm font-medium text-[#1B263B] group-hover:text-[#950E1D] transition-colors">
                  {team.contact.phone}
                </div>
              </div>
            </motion.a>
          )}
          {team.contact?.officeLocation && (
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
                  {team.contact.officeLocation}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Social Links */}
        {(team.contact?.facebook || team.contact?.twitter || team.contact?.linkedIn) && (
          <div className="pt-6 border-t border-slate-100">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-4">Social Media</div>
            <div className="flex flex-wrap gap-3">
              {team.contact?.facebook && (
                <motion.a
                  variants={itemVariants}
                  href={team.contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </motion.a>
              )}
              {team.contact?.twitter && (
                <motion.a
                  variants={itemVariants}
                  href={team.contact.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </motion.a>
              )}
              {team.contact?.linkedIn && (
                <motion.a
                  variants={itemVariants}
                  href={team.contact.linkedIn}
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
      case "overview":
        return <OverviewContent />;
      case "publications":
        return <PublicationsContent />;
      case "expertise":
        return <ExpertiseContent />;
      case "achievements":
        return <AchievementsContent />;
      case "profiles":
        return <ProfilesContent />;
      case "contact":
        return <ContactContent />;
      default:
        return <OverviewContent />;
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

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Link href="/teams" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Teams
            </Link>
          </Button>
        </motion.div>

        {/* Team Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl lg:rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden mb-6"
        >
          {/* Top Accent Bar */}
          <div className="h-1.5 bg-gradient-to-r from-[#950E1D] via-[#B01124] to-[#950E1D]" />

          <div className="p-5 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Team Logo */}
              <div className="flex-shrink-0">
                <div className="relative w-28 h-28 lg:w-36 lg:h-36 mx-auto lg:mx-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl lg:rounded-3xl transform rotate-3 opacity-20" />
                  <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                    <Image
                      src={team.profilePicture || "https://www.gravatar.com/avatar/?d=mp&f=y&r=pg&s=200&format=png"}
                      alt={team.teamName}
                      fill
                      sizes="(max-width: 1024px) 112px, 144px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#950E1D] text-white p-1.5 lg:p-2 rounded-lg lg:rounded-xl shadow-lg">
                    <Users className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                </div>
              </div>

              {/* Team Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#950E1D]/5 border border-[#950E1D]/10 text-[#950E1D] text-xs font-medium mb-3">
                  <Sparkles className="w-3 h-3" />
                  Research Team
                </div>

                <h1 className="text-2xl lg:text-4xl font-bold text-[#1B263B] mb-2">
                  {team.teamName}
                </h1>

                {team.fieldOfResearch && (
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
                    <span className="px-3 py-1 bg-[#1B263B]/5 text-[#1B263B] text-sm font-medium rounded-full border border-[#1B263B]/10">
                      {team.fieldOfResearch}
                    </span>
                  </div>
                )}

                <p className="text-slate-600 text-sm lg:text-base leading-relaxed max-w-2xl">
                  {team.about}
                </p>

                {/* Quick Contact */}
                {team.email && (
                  <div className="flex items-center justify-center lg:justify-start gap-3 mt-4">
                    <a
                      href={`mailto:${team.email}`}
                      className="inline-flex items-center gap-1.5 text-xs text-[#950E1D] hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {team.email}
                    </a>
                  </div>
                )}

                {/* Owner Actions */}
                {isOwner && (
                  <div className="flex items-center justify-center lg:justify-start gap-3 mt-4">
                    <Link
                      href={`/u/teams/${team.id || team._id}/edit`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#950E1D] text-white text-sm font-medium rounded-xl hover:bg-[#7a0c18] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Team
                    </Link>
                    <Link
                      href="/u/my-teams"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Manage Teams
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 mb-6"
        >
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm shadow-slate-200/50 border border-slate-100 text-center hover:shadow-md hover:border-[#950E1D]/20 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center p-2 bg-[#950E1D]/10 rounded-lg lg:rounded-xl mb-2 group-hover:bg-[#950E1D]/20 transition-colors">
                <metric.icon className="w-4 h-4 lg:w-5 lg:h-5 text-[#950E1D]" />
              </div>
              <div className="text-xl lg:text-2xl font-bold text-[#1B263B] mb-0.5">
                {metric.value}
              </div>
              <div className="text-[10px] lg:text-xs text-slate-500 uppercase tracking-wide">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="sticky top-4 z-30 mb-6"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100/80 p-2">
            <TeamTabs activeTab={activeTab} onTabChange={setActiveTab} />
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
