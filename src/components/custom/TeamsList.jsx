"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Users,
    Crown,
    FileText,
    ArrowRight,
    Sparkles,
    Target,
    ChevronRight,
    Quote,
} from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};



const getInitials = (name) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
};

const getGradient = (index) => {
    const gradients = [
        "bg-gradient-to-r from-[#6F0A14] to-[#8E0E1B]",
    ];
    return gradients[index % gradients.length];
};

const TeamsList = ({researchTeams}) => {
    return (
        <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
            </div>

            {/* Dot Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #1B263B 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 text-sm font-semibold mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-[#950E1D]" />
                        Collaborative Excellence
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1B263B] tracking-tight mb-5">
                        Research{" "}
                        <span className="bg-gradient-to-r from-[#950E1D] to-[#B01124] bg-clip-text text-transparent">
                            Teams
                        </span>
                    </h2>

                    <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                        Discover innovative research teams driving breakthrough discoveries across diverse disciplines
                    </p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-8 sm:gap-16 mb-16 py-6 px-8 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-100"
                >
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-[#1B263B]">50+</div>
                        <div className="text-sm text-slate-500 mt-1">Research Teams</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-[#950E1D]">500+</div>
                        <div className="text-sm text-slate-500 mt-1">Team Members</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-[#1B263B]">1,200+</div>
                        <div className="text-sm text-slate-500 mt-1">Publications</div>
                    </div>
                </motion.div>

                {/* Teams Grid - 2 per row on desktop */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {researchTeams.map((team, idx) => (
                        <motion.article
                            key={idx}
                            variants={itemVariants}
                            className="group relative bg-white rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-2 transition-all duration-500"
                        >
                            {/* Top Gradient Bar */}
                            <div className={`h-2 bg-gradient-to-r ${getGradient(idx)}`} />

                            {/* Card Content */}
                            <div className="p-6 sm:p-8">
                                {/* Header Section */}
                                <div className="flex flex-col sm:flex-row sm:items-start gap-5 mb-6">
                                    {/* Team Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(idx)} rounded-2xl transform rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500`} />
                                        {team.profilePicture ? (
                                            <img
                                                src={team.profilePicture}
                                                alt={team.owner}
                                                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-lg"
                                            />
                                        ) : (
                                            <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${getGradient(idx)} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                                                {getInitials(team.teamName)}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-md">
                                            <Crown className="w-5 h-5 text-amber-500" />
                                        </div>
                                    </div>

                                    {/* Team Info */}
                                    <div className="flex-1">
                                        <h3 className="text-xl sm:text-2xl font-bold text-[#1B263B] group-hover:text-[#950E1D] transition-colors duration-300 leading-tight mb-2">
                                            {team.teamName}
                                        </h3>
                                        
                                        {/* Lead Badge */}
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg mb-3">
                                            <span className="text-xs text-slate-500">Led by</span>
                                            <span className="text-sm font-semibold text-[#1B263B]">{team.owner}</span>
                                        </div>

                                        {/* Moto */}
                                        <div className="flex items-start gap-2 text-amber-600">
                                            <Quote className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm font-medium italic">{team.moto}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* About Team */}
                                <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-slate-600 leading-relaxed">
                                        {team.about}
                                    </p>
                                </div>

                                {/* Research Fields */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {team.fieldOfResearch.map((field, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 bg-[#1B263B]/5 text-[#1B263B] text-sm font-medium rounded-full border border-[#1B263B]/5 hover:bg-[#1B263B]/10 transition-colors"
                                        >
                                            {field}
                                        </span>
                                    ))}
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-100 group-hover:border-amber-200 transition-colors">
                                        <div className="p-2 bg-amber-100 rounded-xl">
                                            <Users className="w-5 h-5 text-[#950E1D]" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-[#1B263B]">{team.memberCount}</div>
                                            <div className="text-xs text-slate-400 uppercase tracking-wide">Members</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-100 group-hover:border-amber-200 transition-colors">
                                        <div className="p-2 bg-amber-100 rounded-xl">
                                            <FileText className="w-5 h-5 text-[#950E1D]" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-[#1B263B]">{team.papersPublished}</div>
                                            <div className="text-xs text-slate-400 uppercase tracking-wide">Publications</div>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="w-full rounded-xl bg-slate-50 hover:bg-[#950E1D] text-slate-700 hover:text-white transition-all duration-300 group/btn font-medium h-12"
                                >
                                    <Link href={`/teams/${team.id}`} className="justify-between px-6">
                                        <span>Explore Team</span>
                                        <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TeamsList;
