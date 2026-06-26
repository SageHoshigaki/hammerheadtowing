import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { RecoveryPage } from "./pages/RecoveryPage";
import { PrestigePage } from "./pages/PrestigePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Recovery Site */}
        <Route path="/" element={<RecoveryPage />} />
        <Route path="/recovery" element={<RecoveryPage />} />

        {/* Prestige Transport */}
        <Route path="/prestige" element={<PrestigePage />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}