"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Users,
    Building2,
    FileText,
    Link2,
    BarChart3,
    ArrowRight,
    Sparkles,
    Award,
    MapPin,
    ChevronRight,
} from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
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
        "bg-gradient-to-r from-[#1B263B] to-[#2E4A73]"

    ];
    return gradients[index % gradients.length];
};

const ScholarsList = ({researchers}) => {
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
                        Distinguished Scholars
                    </motion.div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1B263B] tracking-tight mb-5">
                        Meet Our{" "}
                        <span className="bg-gradient-to-r from-[#950E1D] to-[#B01124] bg-clip-text text-transparent">
                            Researchers
                        </span>
                    </h2>

                    <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                        Discover brilliant minds pushing the boundaries of knowledge across diverse fields
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
                        <div className="text-3xl sm:text-4xl font-bold text-[#1B263B]">500+</div>
                        <div className="text-sm text-slate-500 mt-1">Researchers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-[#950E1D]">50K+</div>
                        <div className="text-sm text-slate-500 mt-1">Publications</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-[#1B263B]">120+</div>
                        <div className="text-sm text-slate-500 mt-1">Institutions</div>
                    </div>
                </motion.div>

                {/* Scholars Grid - 4 per row on desktop */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {researchers.map((scholar, idx) => (
                        <motion.article
                            key={idx}
                            variants={itemVariants}
                            className="group relative bg-white rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-2 transition-all duration-500"
                        >
                            {/* Top Gradient Bar */}
                            <div className={`h-1.5 bg-gradient-to-r ${getGradient(idx)}`} />

                            {/* Card Content */}
                            <div className="p-6">
                                {/* Header with Avatar */}
                                <div className="flex items-start gap-4 mb-5">
                                    {/* Avatar with Fallback */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(idx)} rounded-2xl transform rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500`} />
                                        {scholar.profilePicture ? (
                                            <img
                                                src={scholar.profilePicture}
                                                alt={scholar.name}
                                                className="relative w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                                            />
                                        ) : (
                                            <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradient(idx)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                                {getInitials(scholar.name)}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1.5 -right-1.5 bg-white p-1 rounded-lg shadow-md">
                                            <Award className="w-3.5 h-3.5 text-amber-500" />
                                        </div>
                                    </div>

                                    {/* Name & Title */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-[#1B263B] group-hover:text-[#950E1D] transition-colors duration-300 leading-tight mb-1">
                                            {scholar.name}
                                        </h3>
                                        <p className="text-amber-600 text-sm font-medium mb-1">
                                            {scholar.title}
                                        </p>
                                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                                            <MapPin className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">{scholar.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Institution */}
                                <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <Building2 className="w-4 h-4 text-[#950E1D] flex-shrink-0" />
                                    <span className="text-sm text-slate-600 font-medium truncate">
                                        {scholar.institution}
                                    </span>
                                </div>

                                {/* Bio */}
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                                    {scholar.bio}
                                </p>

                                {/* Research Fields */}
                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {scholar.fieldOfResearch.slice(0, 2).map((field, i) => (
                                        <span
                                            key={i}
                                            className="px-2.5 py-1 bg-[#1B263B]/5 text-[#1B263B] text-xs font-medium rounded-full border border-[#1B263B]/5 hover:bg-[#1B263B]/10 transition-colors"
                                        >
                                            {field}
                                        </span>
                                    ))}
                                    {scholar.fieldOfResearch.length > 2 && (
                                        <span className="px-2 py-1 text-slate-400 text-xs">
                                            +{scholar.fieldOfResearch.length - 2}
                                        </span>
                                    )}
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-2 mb-5">
                                    <div className="text-center p-2.5 bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-100 group-hover:border-amber-200 transition-colors">
                                        <FileText className="w-4 h-4 text-[#950E1D] mx-auto mb-1" />
                                        <div className="text-base font-bold text-[#1B263B]">
                                            {scholar.papersPublished}
                                        </div>
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wide">Papers</div>
                                    </div>
                                    <div className="text-center p-2.5 bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-100 group-hover:border-amber-200 transition-colors">
                                        <Link2 className="w-4 h-4 text-[#950E1D] mx-auto mb-1" />
                                        <div className="text-base font-bold text-[#1B263B]">
                                            {scholar.citations}
                                        </div>
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wide">Cites</div>
                                    </div>
                                    <div className="text-center p-2.5 bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-100 group-hover:border-amber-200 transition-colors">
                                        <BarChart3 className="w-4 h-4 text-[#950E1D] mx-auto mb-1" />
                                        <div className="text-base font-bold text-[#1B263B]">
                                            {scholar.hIndex}
                                        </div>
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wide">h-index</div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="w-full rounded-xl bg-slate-50 hover:bg-[#950E1D] text-slate-700 hover:text-white transition-all duration-300 group/btn font-medium"
                                >
                                    <Link href={`/scholars/${scholar.username}`} className="justify-between px-4">
                                        <span>View Profile</span>
                                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

                {/* View All CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                </motion.div>
            </div>
        </section>
    );
};

export default ScholarsList;
