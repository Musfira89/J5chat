import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Onboard from "../src/pages/Onboard";
import TermsAndConditions from "../src/pages/TermsAndConditions";
import PrivacyPolicy from "../src/pages/PrivacyPolicy";
import InvitePage from "./pages/InvitePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboard />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
