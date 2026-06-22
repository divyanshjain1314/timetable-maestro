import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  Table,
  Sparkles,
  UserMinus,
} from "lucide-react";

// Layout Imports
import { Sidebar } from "@/components/dashboard/layout/sidebar";
import { MobileNav } from "@/components/dashboard/layout/mobile-nav";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const nav = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "classes", label: "Classes", icon: GraduationCap },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "periods", label: "Period Slots", icon: Clock },
    { id: "timetable", label: "Generate Timetable", icon: Table },
    { id: "substitution", label: "Proxy Manager", icon: UserMinus }, // <-- NAYA TAB
  ];

  // URL se current tab nikalne ka logic
  // Agar path "/dashboard/teachers" hai, toh "teachers" nikalega
  // Agar path sirf "/dashboard" ya "/dashboard/" hai, toh "overview" manega
  const pathParts = location.pathname.split("/").filter(Boolean);
  const activeTab =
    pathParts.length === 1 && pathParts[0] === "dashboard"
      ? "overview"
      : pathParts[pathParts.length - 1];

  // Tab click hone par route change karne ka function
  const handleNavClick = (id: string) => {
    if (id === "overview") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard/${id}`);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground selection:bg-primary/20">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -right-[5%] bottom-[20%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      {/* Desktop Sidebar */}
      <Sidebar nav={nav} activeTab={activeTab} setTab={handleNavClick} />

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-1 flex-col overflow-x-hidden overflow-y-auto scroll-smooth">
        {/* Mobile Navigation Header */}
        <MobileNav nav={nav} activeTab={activeTab} setTab={handleNavClick} />

        {/* Content Wrapper */}
        <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-24 md:px-10 md:py-12">
          <AnimatePresence mode="wait">
            {/* key={location.pathname} zaroori hai, ye Framer ko batata hai ki route change ho gaya hai */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-full"
            >
              {/* Magic Happens Here: Jo bhi route active hoga, uska component yahan render hoga */}
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
