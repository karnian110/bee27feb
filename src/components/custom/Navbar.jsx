import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileMenu from "./MobileMenu";
import { UserPlus } from "lucide-react";
import Logo from "@/components/custom/Logo";
const menuItems = [
    { label: "Scholars", href: "/scholars" },
    { label: "Teams", href: "/teams" },
    { label: "Academy", href: "/academy" },
];

export default function Navbar() {
    return (
        <header className="relative md:sticky md:top-0 z-50 w-full overflow-hidden">
            {/* Animated golden background – no tailwind.config.js */}
            <div className="absolute inset-0 bg-[#1B263B] overflow-hidden">

                {/* Left glow */}
                <div
                    className="
      absolute -left-16 top-1/2 -translate-y-1/2
      h-28 w-28 rounded-full bg-amber-400/20 blur-[40px]
      sm:h-36 sm:w-36 sm:blur-[55px]
      md:h-44 md:w-44 md:blur-[70px]
      animate-pulse motion-safe:animate-pulse
    "
                    style={{ animationDuration: "12s" }}
                />

                {/* Top glow */}
                <div
                    className="
      absolute left-1/4 -top-10
      h-24 w-24 rounded-full bg-yellow-300/15 blur-[35px]
      sm:h-32 sm:w-32 sm:blur-[50px]
      md:h-36 md:w-36 md:blur-[60px]
      animate-pulse motion-safe:animate-pulse
    "
                    style={{ animationDuration: "16s" }}
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

                {/* Bottom glow */}
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
      absolute -right-16 top-1/2 -translate-y-1/2
      h-32 w-32 rounded-full bg-yellow-500/15 blur-[45px]
      sm:h-40 sm:w-40 sm:blur-[60px]
      md:h-48 md:w-48 md:blur-[80px]
      animate-pulse motion-safe:animate-pulse
    "
                    style={{ animationDuration: "18s" }}
                />

            </div>
            {/* Animated golden background – no tailwind.config.js */}
            {/* Navbar content */}
            <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span>
                        <Logo theme="dark" />
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 backdrop-blur-md">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative px-5 py-2 text-sm font-medium text-white/70 transition-all hover:text-white rounded-full hover:bg-white/10"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Button
                        asChild
                        variant="crimson"
                        className='text-white'
                    >
                        <Link href="/join">
                            <UserPlus className="h-5 w-5 mr-2" />
                            Join Now
                        </Link>
                    </Button>
                </div>

                {/* Mobile Menu (Client Component) */}
                <MobileMenu menuItems={menuItems} />
            </div>
        </header>
    );
}
