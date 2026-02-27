import { Scale, Shield, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions",
};

export default function Terms() {
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
              <Scale className="w-6 h-6 text-[#950E1D]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1B263B]">
              Terms & Conditions
            </h1>
          </div>

          {/* Last updated note (optional) */}
          <p className="text-slate-500 mb-8 animate-slide-up delay-1">
            Last updated: March 1, 2025
          </p>

          {/* Content sections */}
          <div className="space-y-8">
            {/* Terms and Conditions intro */}
            <section className="animate-slide-up delay-2">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Terms and Conditions</h2>
              <p className="text-slate-700 leading-relaxed">
                Welcome to our platform. By creating an account or using any part of this website, you agree to the terms outlined below. These terms exist to ensure the smooth operation, security, and integrity of the platform.
              </p>
            </section>

            {/* User Accounts */}
            <section className="animate-slide-up delay-2">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">User Accounts</h2>
              <p className="text-slate-700 leading-relaxed">
                By registering on this platform, you acknowledge that all information you provide must be accurate and lawful. You are responsible for maintaining the confidentiality of your account credentials and for all activities carried out under your account.
              </p>
            </section>

            {/* Administrative Access */}
            <section className="animate-slide-up delay-3">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Administrative Access</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                The platform administrator retains full control over the system. This includes, but is not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Viewing any user profile and associated data</li>
                <li>Editing or modifying user information</li>
                <li>Suspending or permanently deleting user accounts</li>
                <li>Taking these actions without prior notice if deemed necessary</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-3">
                Administrative actions may be taken to maintain security, comply with legal obligations, prevent misuse, or ensure platform integrity.
              </p>
            </section>

            {/* Account Termination */}
            <section className="animate-slide-up delay-3">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Account Termination</h2>
              <p className="text-slate-700 leading-relaxed">
                User accounts may be suspended or deleted at any time if there is a violation of these terms, suspicious activity, or any action that may harm the platform or its users. In such cases, no advance notification is guaranteed.
              </p>
            </section>

            {/* Service Availability */}
            <section className="animate-slide-up delay-4">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Service Availability</h2>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any feature or service at any time without liability. Continuous access to the platform is not guaranteed.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="animate-slide-up delay-4">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed">
                The platform is provided “as is.” We are not responsible for data loss, account deletion, or service interruptions resulting from administrative decisions or technical issues.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="animate-slide-up delay-4">
              <h2 className="text-2xl font-bold text-[#1B263B] mb-3">Changes to Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                These terms may be updated at any time. Continued use of the platform after changes implies acceptance of the revised terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}