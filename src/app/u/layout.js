import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "User Dashboard - ScholarBee",
  description: "User dashboard for ScholarBee",
};

async function UserLayout({ children }) {
  const user = await getCurrentUser();

  // Check if user is authenticated
  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}

export default UserLayout;
