import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@/styles/globals.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { SessionsPage } from "./pages/admin/sessions.tsx";
import { AdminLayout } from "./layouts/adminLayout.tsx";
import { CoachesPage } from "./pages/admin/coaches.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="sessions" element={<SessionsPage />} />
          <Route path="coaches" element={<CoachesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster />
  </StrictMode>,
);

/*

 
 */
