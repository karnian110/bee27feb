import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export const metadata = {
  title: "Admin Panel - ScholarBee",
  description: "Administration panel for ScholarBee",
};

async function AdminLayout({ children }) {
  const user = await getCurrentUser();

  // Check if user is authenticated
  if (!user) {
    redirect("/login");
  }

  // Check if user has admin or moderator role
  const isAdmin = user.role === "admin";
  const isModerator = user.role === "moderator";

  if (!isAdmin && !isModerator) {
    redirect("/u/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-[#1B263B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Admin Panel</h1>
              <span className="px-2 py-1 text-xs bg-orange-600 rounded">
                {user.role.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/u/dashboard"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Sub-navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {isAdmin && (
              <Link
                href="/admin/create-user"
                className="py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors"
              >
                Manage Users
              </Link>
            )}
            <Link
              href="/admin/manage-featured"
              className="py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors"
            >
              Manage Featured
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
