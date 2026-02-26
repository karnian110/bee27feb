"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Link2,
    BarChart3,
    TrendingUp,
    Award,
    ArrowRight,
    Building2,
    Sparkles,
} from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const FeaturedResearcher = () => {
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

    const metrics = [
        { icon: FileText, value: researcher.papersPublished, label: "Papers" },
        { icon: Link2, value: researcher.citations, label: "Citations" },
        { icon: BarChart3, value: researcher.hIndex, label: "h-index" },
        { icon: TrendingUp, value: researcher.i10Index, label: "i10-index" },
    ];

    return (
        <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
            {/* Subtle Background Pattern */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #1B263B 1px, transparent 0)`,
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        Researcher Spotlight
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B263B] tracking-tight mb-3">
                        Featured Researcher
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Meet our outstanding researcher of the month and explore their groundbreaking work
                    </p>
                    <br />
                    <Button
                        asChild
                        variant="orange"
                    >
                        <Link href="#">Explore More</Link>
                    </Button>
                </motion.div>

                {/* Researcher Card */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
                >
                    {/* Card Header with Gradient Accent */}
                    <div className="h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

                    <div className="p-6 sm:p-8 lg:p-10">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                            {/* Left: Profile Section */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col items-center lg:items-start"
                            >
                                {/* Profile Picture */}
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl transform rotate-6 opacity-20" />
                                    <img
                                        src={researcher.profilePicture}
                                        alt={researcher.name}
                                        className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover border-4 border-white shadow-lg"
                                    />
                                    <div className="absolute -bottom-3 -right-3 bg-amber-500 text-white p-2 rounded-xl shadow-lg">
                                        <Award className="w-5 h-5 text-[#950E1D]" />
                                    </div>
                                </div>

                                {/* Quick Info */}
                                <div className="text-center lg:text-left">
                                    <h3 className="text-2xl font-bold text-[#1B263B] mb-1">
                                        {researcher.name}
                                    </h3>
                                    <p className="text-amber-600 font-medium mb-2">{researcher.title}</p>
                                    <div className="flex items-center justify-center lg:justify-start gap-1.5 text-slate-500 text-sm">
                                        <Building2 className="w-4 h-4 text-[#950E1D]" />
                                        <span>{researcher.institution}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right: Details Section */}
                            <div className="flex-1">
                                {/* Bio */}
                                <motion.div variants={itemVariants} className="mb-6">
                                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                        About
                                    </h4>
                                    <p className="text-slate-600 leading-relaxed text-base">
                                        {researcher.bio}
                                    </p>
                                </motion.div>

                                {/* Fields & Expertise */}
                                <motion.div
                                    variants={itemVariants}
                                    className="grid sm:grid-cols-2 gap-6 mb-8"
                                >
                                    {/* Fields of Research */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                            Fields of Research
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {researcher.fieldOfResearch.map((field, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1.5 bg-[#1B263B]/5 text-[#1B263B] text-sm font-medium rounded-lg border border-[#1B263B]/10 hover:bg-[#1B263B]/10 transition-colors"
                                                >
                                                    {field}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Expertise */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                            Expertise
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {researcher.expertise.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Metrics */}
                                <motion.div
                                    variants={itemVariants}
                                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                                >
                                    {metrics.map((metric, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                                                    <metric.icon className="w-4 h-4 text-[#950E1D]" />
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-[#1B263B]">
                                                {metric.value}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium">
                                                {metric.label}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>

                                {/* Buttons */}
                                <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                                    <Button
                                        asChild
                                        variant="crimson"
                                        className="rounded-xl h-11 px-6 gap-2 group"
                                    >
                                        <Link href="#">
                                            View Full Profile
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedResearcher;
