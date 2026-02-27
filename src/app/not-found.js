import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "404 - Not Found",
};

export default function NotFound() {
  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slide-up {
          opacity: 0;
          animation: slideUp 0.6s ease-out forwards;
        }

        .delay-1 {
          animation-delay: 0.1s;
        }

        .delay-2 {
          animation-delay: 0.2s;
        }

        .delay-3 {
          animation-delay: 0.3s;
        }

        .icon-pulse {
          animation: gentlePulse 2s infinite ease-in-out;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center px-4 animate-fade-in">
        <div className="max-w-md text-center">
          {/* Animated icon with gentle pulse */}
          <div className="icon-pulse">
            <AlertCircle className="mx-auto w-20 h-20 text-[#950E1D] mb-6" strokeWidth={1.5} />
          </div>

          {/* 404 heading with slide-up */}
          <h1 className="text-7xl font-extrabold text-[#1B263B] mb-3 animate-slide-up delay-1">
            404
          </h1>

          {/* Subheading with slide-up */}
          <p className="text-2xl text-slate-700 mb-4 animate-slide-up delay-2">
            Page not found
          </p>

          {/* Description with slide-up */}
          <p className="text-slate-500 mb-10 text-lg leading-relaxed animate-slide-up delay-2">
            Sorry, we couldn’t find the page you’re looking for. It may have been moved or deleted.
          </p>

          {/* Button with hover animation */}
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-[#950E1D] text-white rounded-lg font-medium text-lg shadow-lg hover:bg-[#7a0c18] hover:scale-105 transform transition-all duration-300 ease-out animate-slide-up delay-3"
          >
            Go back home
          </Link>
        </div>
      </div>
    </>
  );
}