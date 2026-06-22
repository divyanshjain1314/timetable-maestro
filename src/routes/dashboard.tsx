import { useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  Table,
  Sparkles,
} from "lucide-react";

// Layout Imports
import { Sidebar } from "@/components/dashboard/layout/sidebar";
import { MobileNav } from "@/components/dashboard/layout/mobile-nav";

// Tabs Imports
import { Overview } from "@/components/dashboard/tabs/overview";
import { TeachersTab } from "@/components/dashboard/tabs/teachers";
import { ClassesTab } from "@/components/dashboard/tabs/classes";
import { SubjectsTab } from "@/components/dashboard/tabs/subjects";
import { PeriodsTab } from "@/components/dashboard/tabs/periods";
import { TimetableTab } from "@/components/dashboard/tabs/timetable";

export type Tab =
  | "overview"
  | "teachers"
  | "classes"
  | "subjects"
  | "periods"
  | "timetable";

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("overview");

  const nav = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "classes", label: "Classes", icon: GraduationCap },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "periods", label: "Period Slots", icon: Clock },
    { id: "timetable", label: "Generate Timetable", icon: Table },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar nav={nav} activeTab={tab} setTab={setTab as any} />

      <main className="flex-1 overflow-x-hidden relative">
        <MobileNav nav={nav} activeTab={tab} setTab={setTab as any} />

        <div className="mx-auto max-w-6xl px-6 pb-10 pt-24 md:py-10 md:px-10">
          {tab === "overview" && <Overview onJump={setTab as any} />}
          {tab === "teachers" && <TeachersTab />}
          {tab === "classes" && <ClassesTab />}
          {tab === "subjects" && <SubjectsTab />}
          {tab === "periods" && <PeriodsTab />}
          {tab === "timetable" && <TimetableTab />}
        </div>
      </main>
    </div>
  );
}
