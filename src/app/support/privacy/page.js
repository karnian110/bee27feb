import { Shield, Eye, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicy() {
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

        .delay-4 {
          animation-delay: 0.4s;
        }
      `}</style>

      <div className="min-h-screen bg-white flex items-start justify-center px-4 py-12 animate-fade-in">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8 md:p-10">
          {/* Header with icon */}
          <div className="flex items-center gap-3 mb-6 animate-slide-up delay-1">
            <div className="bg-[#950E1D]/10 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-[#950E1D]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1B263B]">
              Privacy Policy
            </h1>
          </div>

          {/* Last updated note */}
          <p className="text-slate-500 mb-8 animate-slide-up delay-1">
            Last updated: March 1, 2025
          </p>

          {/* Content sections */}
          <div className="space-y-8">
            {/* Introduction */}
            <section className="animate-slide-up delay-2">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Privacy Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                Your privacy is important to us. This policy explains how user data is collected, accessed, and managed on this platform.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="animate-slide-up delay-2">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Information We Collect</h2>
              <p className="text-slate-700 leading-relaxed">
                We may collect personal information such as your name, email address, profile details, and activity data when you register or use the platform.
              </p>
            </section>

            {/* Use of Information */}
            <section className="animate-slide-up delay-3">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Use of Information</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                Collected data is used to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Provide and improve platform services</li>
                <li>Maintain security and prevent misuse</li>
                <li>Administer user accounts and content</li>
              </ul>
            </section>

            {/* Administrative Data Access */}
            <section className="animate-slide-up delay-3">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Administrative Data Access</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                The platform administrator has full access to all user data, including profiles, uploaded content, and activity logs. This access may be used for moderation, maintenance, legal compliance, or system improvement.
              </p>
              <p className="text-slate-700 leading-relaxed mb-3">
                The administrator may:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>View user profiles and data</li>
                <li>Modify stored information</li>
                <li>Delete user profiles and associated data without prior notification</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section className="animate-slide-up delay-4">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Data Retention</h2>
              <p className="text-slate-700 leading-relaxed">
                User data may be retained as long as necessary for platform operations or legal obligations. Deleted accounts may have their data permanently removed from the system.
              </p>
            </section>

            {/* Data Security */}
            <section className="animate-slide-up delay-4">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Data Security</h2>
              <p className="text-slate-700 leading-relaxed">
                Reasonable measures are taken to protect user data. However, no system can guarantee absolute security, and users acknowledge this risk.
              </p>
            </section>

            {/* Policy Updates */}
            <section className="animate-slide-up delay-4">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Policy Updates</h2>
              <p className="text-slate-700 leading-relaxed">
                This privacy policy may be revised periodically. Continued use of the platform signifies acceptance of any updates.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}