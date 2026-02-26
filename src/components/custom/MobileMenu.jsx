"use client";
import Applogo from "@/components/custom/Applogo";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  GraduationCap,
  Users,
  School,
  UserPlus,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import App from "next/app";

const iconMap = {
  Scholars: GraduationCap,
  Teams: Users,
  Academy: School,
  Join: UserPlus,
};

export default function MobileMenu({ menuItems = [] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const isActiveRoute = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className="relative h-10 w-10 rounded-xl text-white hover:bg-white/10"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-[320px] border-none bg-[#1B263B] p-0 sm:w-[380px]" //Background color of the navbar
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <SheetHeader className="flex flex-row items-center justify-between border-b border-white/10 p-5">
              <SheetTitle className="flex items-center gap-3">
                <Applogo size={52} />
              </SheetTitle>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-9 w-9 rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetHeader>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-4">
              {menuItems.map((item, index) => {
                const Icon = iconMap[item.label] ?? GraduationCap;
                const isActive = isActiveRoute(item.href);

                return (
                  <Link
                    key={`${item.href}-${index}`}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center gap-4 rounded-xl px-4 py-3.5 transition
                      ${isActive
                        ? "bg-[#950E1D]/80 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg
                        ${isActive
                          ? "bg-white/20"
                          : "bg-white/5 group-hover:bg-white/10"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="flex-1 font-medium">{item.label}</span>

                    <ChevronRight
                      className={`h-5 w-5 transition
                        ${isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                        }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="mt-auto border-t border-white/10 p-5">
              <div className="mb-4 rounded-xl bg-white/5 p-4">
                <p className="text-sm text-white/60">
                  Join our community of scholars and unlock your potential today.
                </p>
              </div>

              <Button
                variant="crimson"
                onClick={() => setIsOpen(false)}
                asChild
              >
                <Link href="/join">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Join Now
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}