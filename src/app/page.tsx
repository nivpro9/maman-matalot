"use client";

import { useState, useEffect } from "react";
import LoginScreen from "@/components/LoginScreen";
import Dashboard from "@/components/Dashboard";
import { USERS } from "@/lib/constants";
import type { User } from "@/types";

const SESSION_KEY = "maman_session";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted session + dark mode preference
  useEffect(() => {
    const savedCode = sessionStorage.getItem(SESSION_KEY);
    if (savedCode && USERS[savedCode]) {
      setCurrentUser(USERS[savedCode]);
    }
    const savedDark = localStorage.getItem("maman_dark") === "true";
    setDarkMode(savedDark);
    setHydrated(true);
  }, []);

  // Apply dark mode class to <html>
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("maman_dark", String(darkMode));
  }, [darkMode, hydrated]);

  function handleLogin(code: string) {
    const user = USERS[code];
    if (!user) return;
    sessionStorage.setItem(SESSION_KEY, code);
    setCurrentUser(user);
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white/40 text-lg animate-pulse">ממן מטלות</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      user={currentUser}
      darkMode={darkMode}
      onToggleDark={() => setDarkMode((d) => !d)}
      onLogout={handleLogout}
    />
  );
}
