"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Users,
    BookOpen,
    Calendar,
    ExternalLink,
    Quote,
    TrendingUp,
    Sparkles,
    User,
} from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};


const FeaturedResearch = ({ featuredResearchPapers }) => {
    const [imageErrors, setImageErrors] = React.useState({});

    const handleImageError = (idx) => {
        setImageErrors(prev => ({ ...prev, [idx]: true }));
    };

    return (
        <section className="relative py-16 lg:py-24 bg-white overflow-hidden">
            {/* Subtle Background Pattern */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #1B263B 1px, transparent 0)`,
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4 text-[#950E1D]" />
                        Latest Publications
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B263B] tracking-tight mb-3">
                        Featured Research Papers
                    </h2>
                    <p className="text-slate-500 text-base max-w-2xl mx-auto">
                        Discover groundbreaking research from our community of scholars
                    </p>
                </motion.div>

                {/* Cards - Single Column Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-col gap-5"
                >
                    {featuredResearchPapers.map((paper, idx) => (
                        <motion.article
                            key={idx}
                            variants={itemVariants}
                            className="group relative bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {/* Card Top Accent */}
                            <div className="h-1 bg-gradient-to-r from-[#950E1D] via-[#B01124] to-[#950E1D]" />

                            <div className="flex flex-col sm:flex-row">
                                {/* Researcher Image - Left Side */}
                                <div className="relative w-full sm:w-48 lg:w-56 flex-shrink-0">
                                    <div className="relative h-48 sm:h-full min-h-[200px] sm:min-h-full bg-gradient-to-br from-slate-100 to-slate-200">
                                        {(paper.researcherImage || paper.profilePicture) && !imageErrors[idx] ? (
                                            <Image
                                                src={paper.researcherImage || paper.profilePicture}
                                                alt={paper.authors?.[0] || "Researcher"}
                                                fill
                                                className="object-cover object-top"
                                                sizes="(max-width: 640px) 100vw, 224px"
                                                unoptimized={(paper.researcherImage || paper.profilePicture)?.includes('example.com')}
                                                onError={() => handleImageError(idx)}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1B263B] to-[#2d3d5c]">
                                                <div className="text-center">
                                                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                                                        <User className="w-8 h-8 text-white/60" />
                                                    </div>
                                                    <span className="text-white/60 text-sm font-medium">
                                                        {paper.authors?.[0]?.split(" ")?.[0] || "Researcher"}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {/* Gradient Overlay for text readability on mobile */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent sm:bg-gradient-to-r" />
                                    </div>
                                    
                                    {/* Author Badge */}
                                    <div className="absolute bottom-3 left-3 right-3 sm:right-auto">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-medium text-[#1B263B] shadow-lg">
                                            <div className="w-5 h-5 rounded-full bg-[#950E1D]/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-[#950E1D] text-[10px] font-bold">
                                                    {paper.authors?.[0]?.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="truncate max-w-[120px]">
                                                {paper.authors?.[0]}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Paper Content - Right Side */}
                                <div className="flex-1 p-5 sm:p-6">
                                    {/* Title Row */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="flex-shrink-0 p-2 bg-[#950E1D]/10 rounded-xl mt-0.5">
                                            <FileText className="w-5 h-5 text-[#950E1D]" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-[#1B263B] leading-snug group-hover:text-[#950E1D] transition-colors">
                                            {paper.title}
                                        </h3>
                                    </div>

                                    {/* Meta Info Row - Inline */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm">
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <Users className="w-3.5 h-3.5 text-[#950E1D]" />
                                            <span>{paper.authors.join(", ")}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <BookOpen className="w-3.5 h-3.5 text-[#950E1D]" />
                                            <span>{paper.journalName}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <Calendar className="w-3.5 h-3.5 text-[#950E1D]" />
                                            <span>{paper.year}</span>
                                        </div>
                                    </div>

                                    {/* Highlights */}
                                    <div className="flex items-start gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <Quote className="w-4 h-4 text-[#950E1D] flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {paper.highlights}
                                        </p>
                                    </div>

                                    {/* Bottom Row: DOI, Citations, Button */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <span className="text-xs text-slate-400 font-mono">
                                                DOI: {paper.doi}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <TrendingUp className="w-3.5 h-3.5 text-[#950E1D]" />
                                                <span className="text-slate-600">
                                                    <span className="font-semibold text-[#1B263B]">{paper.citations}</span> Citations
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            asChild
                                            variant="crimson"
                                            size="sm"
                                            className="rounded-lg gap-1.5 group/btn w-full sm:w-auto h-9"
                                        >
                                            <Link
                                                href={paper.fullPaperLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Read Paper
                                                <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mt-10"
                >
                    <Button
                        asChild
                        variant="orange"
                    >
                        <Link href="/research">View All Papers</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedResearch;
