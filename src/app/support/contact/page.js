import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us",
};

export default function Contact() {
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12 animate-fade-in">
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left column - Contact Information */}
            <div className="bg-[#1B263B] text-white p-8 md:p-10">
              <h2 className="text-3xl font-bold mb-4 animate-slide-up delay-1">
                Get in touch
              </h2>
              <p className="text-slate-300 mb-8 text-lg leading-relaxed animate-slide-up delay-1">
                We'd love to hear from you. Our team is always here to help.
              </p>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4 animate-slide-up delay-2">
                  <div className="bg-[#950E1D]/20 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-[#950E1D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Visit us</h3>
                    <p className="text-slate-300">
                      123 Business Ave, Suite 100<br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 animate-slide-up delay-2">
                  <div className="bg-[#950E1D]/20 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-[#950E1D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Call us</h3>
                    <p className="text-slate-300">
                      +1 (555) 123-4567<br />
                      Mon-Fri, 9am-6pm PST
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 animate-slide-up delay-3">
                  <div className="bg-[#950E1D]/20 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-[#950E1D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email us</h3>
                    <p className="text-slate-300">
                      hello@example.com<br />
                      support@example.com
                    </p>
                  </div>
                </div>

                {/* Business hours */}
                <div className="flex items-start gap-4 animate-slide-up delay-3">
                  <div className="bg-[#950E1D]/20 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-[#950E1D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Business hours</h3>
                    <p className="text-slate-300">
                      Monday – Friday: 9am – 6pm<br />
                      Saturday: 10am – 4pm<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative line */}
              <div className="mt-8 pt-8 border-t border-slate-700 animate-slide-up delay-4">
                <p className="text-slate-400 text-sm">
                  * This is a demo contact page. All information is for demonstration purposes only.
                </p>
              </div>
            </div>

            {/* Right column - Contact Form */}
            <div className="p-8 md:p-10 bg-white">
              <h3 className="text-2xl font-bold text-[#1B263B] mb-6 animate-slide-up delay-1">
                Send a message
              </h3>

              <form className="space-y-5">
                {/* Name field */}
                <div className="animate-slide-up delay-2">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#950E1D] focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Email field */}
                <div className="animate-slide-up delay-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#950E1D] focus:border-transparent outline-none transition"
                  />
                </div>
              </form>


            </div>
          </div>
        </div>
      </div>
    </>
  );
}