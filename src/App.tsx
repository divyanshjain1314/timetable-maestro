import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// Tabs Imports
import { Overview } from "@/components/dashboard/tabs/overview";
import { TeachersTab } from "@/components/dashboard/tabs/teachers";
import { ClassesTab } from "@/components/dashboard/tabs/classes";
import { SubjectsTab } from "@/components/dashboard/tabs/subjects";
import { PeriodsTab } from "@/components/dashboard/tabs/periods";
import { TimetableTab } from "@/components/dashboard/tabs/timetable";
import Index from "./routes";
import Dashboard from "./routes/dashboard";

// Wrapper component for Overview to handle routing jumps
function OverviewWrapper() {
  const navigate = useNavigate();
  // Overview se jab kisi stat par click hoga toh route change ho jayega
  return <Overview onJump={(tab) => navigate(`/dashboard/${tab}`)} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<OverviewWrapper />} />
          <Route path="teachers" element={<TeachersTab />} />
          <Route path="classes" element={<ClassesTab />} />
          <Route path="subjects" element={<SubjectsTab />} />
          <Route path="periods" element={<PeriodsTab />} />
          <Route path="timetable" element={<TimetableTab />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
