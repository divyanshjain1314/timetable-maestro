import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./routes/dashboard";
import Home from "./routes/index";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans antialiased text-foreground">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
