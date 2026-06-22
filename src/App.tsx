import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// Pages Imports
import Index from "@/pages/index"; // Aapka Premium Landing Page
import Dashboard from "@/pages/dashboard"; // Aapka Premium Dashboard Wrapper

// Dashboard Tabs Imports
import { Overview } from "@/components/dashboard/tabs/overview";
import { TeachersTab } from "@/components/dashboard/tabs/teachers";
import { ClassesTab } from "@/components/dashboard/tabs/classes";
import { SubjectsTab } from "@/components/dashboard/tabs/subjects";
import { PeriodsTab } from "@/components/dashboard/tabs/periods";
import { TimetableTab } from "@/components/dashboard/tabs/timetable";
import { SubstitutionTab } from "@/components/dashboard/tabs/substitution";

// Overview Wrapper: Taaki jab user Overview par kisi card par click kare (e.g. "Total Teachers"),
// toh wo smoothly us tab ke URL par jump kar jaye.
function OverviewRoute() {
  const navigate = useNavigate();
  return <Overview onJump={(tab) => navigate(`/dashboard/${tab}`)} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Landing / Home Page Route */}
        <Route path="/" element={<Index />} />

        {/* 2. Dashboard Route (Parent Wrapper) */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Default Route: Agar user sirf "/dashboard" par aata hai, toh Overview khulega */}
          <Route index element={<OverviewRoute />} />

          {/* Child Routes: Dashboard ke andar render hone wale baaki tabs */}
          <Route path="teachers" element={<TeachersTab />} />
          <Route path="classes" element={<ClassesTab />} />
          <Route path="subjects" element={<SubjectsTab />} />
          <Route path="periods" element={<PeriodsTab />} />
          <Route path="timetable" element={<TimetableTab />} />
          <Route path="substitution" element={<SubstitutionTab />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
