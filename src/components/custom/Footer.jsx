"use client";

import Link from "next/link";
import { Mail, Linkedin, Github, Twitter, ExternalLink } from "lucide-react";
import Logo from "@/components/custom/Logo";

const footerSections = {
  explore: {
    title: "Explore",
    links: [
      { label: "Scholars", href: "/scholars" },
      { label: "Teams", href: "/teams" },
      { label: "Academy", href: "/academy" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
};

const socialLinks = [
  { icon: Mail, href: "mailto:hello@scholarbee.com", label: "Email" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Animated background – matching navbar theme exactly */}
      <div className="absolute inset-0 bg-[#1B263B] overflow-hidden">
        {/* Top glow - matching navbar */}
        <div
          className="
            absolute left-1/4 -top-10
            h-24 w-24 rounded-full bg-yellow-300/10 blur-[35px]
            sm:h-32 sm:w-32 sm:blur-[50px]
            md:h-36 md:w-36 md:blur-[60px]
            animate-pulse motion-safe:animate-pulse
          "
          style={{ animationDuration: "16s" }}
        />

        {/* Left glow */}
        <div
          className="
            absolute -left-16 top-1/4 -translate-y-1/2
            h-28 w-28 rounded-full bg-amber-400/20 blur-[40px]
            sm:h-36 sm:w-36 sm:blur-[55px]
            md:h-44 md:w-44 md:blur-[70px]
            animate-pulse motion-safe:animate-pulse
          "
          style={{ animationDuration: "12s" }}
        />

        {/* Center glow */}
        <div
          className="
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            h-36 w-36 rounded-full bg-orange-400/15 blur-[60px]
            sm:h-44 sm:w-44 sm:blur-[75px]
            md:h-52 md:w-52 md:blur-[90px]
            animate-pulse motion-safe:animate-pulse
          "
          style={{ animationDuration: "20s" }}
        />

        {/* Bottom glow - matching navbar */}
        <div
          className="
            absolute right-1/4 -bottom-10
            h-28 w-28 rounded-full bg-amber-500/20 blur-[40px]
            sm:h-36 sm:w-36 sm:blur-[55px]
            md:h-40 md:w-40 md:blur-[65px]
            animate-pulse motion-safe:animate-pulse
          "
          style={{ animationDuration: "14s" }}
        />

        {/* Right glow */}
        <div
          className="
            absolute -right-16 top-3/4 -translate-y-1/2
            h-32 w-32 rounded-full bg-yellow-500/15 blur-[45px]
            sm:h-40 sm:w-40 sm:blur-[60px]
            md:h-48 md:w-48 md:blur-[80px]
            animate-pulse motion-safe:animate-pulse
          "
          style={{ animationDuration: "18s" }}
        />
      </div>

      {/* Footer content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Column - 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Logo theme="dark" />
            </Link>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed">
              Empowering scholars and researchers to transform knowledge into impact through collaboration and innovation.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mt-4">
              <p className="text-white/80 text-sm font-medium mb-3">Stay Updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all"
                />
                <button className="px-4 py-2.5 bg-[#950E1D] hover:bg-[#B01124] text-white text-sm font-medium rounded-xl transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Links Columns - 4 cols */}
          <div className="lg:col-span-4 grid grid-cols-3 gap-6">
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key} className="flex flex-col gap-4">
                <h3 className="text-white font-semibold text-sm">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1 text-white/60 hover:text-white text-sm transition-colors duration-200"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Connect Column - 3 cols */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div>
              <h3 className="text-white font-semibold text-sm mb-4">
                Connect With Us
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="group inline-flex items-center justify-center h-11 w-11 rounded-xl bg-white/10 hover:bg-amber-400/20 text-white/70 hover:text-amber-400 border border-white/10 hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Contact */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-white/50 text-xs uppercase tracking-wide mb-2">Contact</p>
              <a 
                href="mailto:hello@scholarbee.com"
                className="text-white/80 hover:text-amber-400 text-sm transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                hello@scholarbee.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {currentYear} ScholarBee. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/privacy" 
              className="text-white/50 hover:text-white/80 text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-white/50 hover:text-white/80 text-sm transition-colors"
            >
              Terms
            </Link>
            <Link 
              href="/contact" 
              className="text-white/50 hover:text-white/80 text-sm transition-colors"
            >
              Contact
            </Link>
            <a 
              href="#"
              className="inline-flex items-center gap-1 text-white/50 hover:text-amber-400 text-sm transition-colors"
            >
              Status
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
