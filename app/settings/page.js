"use client";

import React, { useState, useContext, useEffect } from "react";
import { Settings, User, Palette, Sun, Moon, Monitor, LogOut } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { ThemeContext } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, profile, loading, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("account");
  const [formData, setFormData] = useState({ display_name: "", bio: "" });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({ display_name: profile.display_name ?? "", bio: profile.bio ?? "" });
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("users")
      .update({ display_name: formData.display_name, bio: formData.bio })
      .eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: "account",    label: "Account",    icon: User    },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const displayName = profile?.display_name ?? user?.email?.split("@")[0] ?? "Echo User";

  return (
    <AppShell showRightSidebar={false}>
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-echo" /> Settings
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sidebar nav */}
          <div className="sm:w-48 flex-shrink-0">
            <div className="space-y-1 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.id} onClick={() => setActiveSection(s.id)}
                    className={cn("flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-all",
                      activeSection === s.id ? "bg-gray-100 dark:bg-gray-700 text-echo" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}>
                    <Icon className="w-4 h-4" /> {s.label}
                  </button>
                );
              })}

              {user && (
                <button onClick={signOut}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all mt-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 p-4">
            {activeSection === "account" && (
              loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-10 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />)}
                </div>
              ) : !user ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sign in to manage your account.</p>
                  <Button onClick={() => window.location.href = "/auth"}>Sign In</Button>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <InitialsAvatar name={displayName} size="lg" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{displayName}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                    <Input value={formData.display_name}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                      placeholder="Your display name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <Input value={profile?.username ?? ""} disabled
                      className="opacity-60 cursor-not-allowed" />
                    <p className="text-xs text-gray-400 mt-1">Username cannot be changed.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                    <Input value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..." />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving}>{saved ? "Saved ✓" : saving ? "Saving…" : "Save Changes"}</Button>
                  </div>
                </form>
              )
            )}

            {activeSection === "appearance" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Theme</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[{ id: "light", label: "Light", icon: Sun }, { id: "dark", label: "Dark", icon: Moon }, { id: "system", label: "System", icon: Monitor }].map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button key={opt.id} onClick={() => setTheme(opt.id)}
                        className={cn("flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                          theme === opt.id ? "border-echo bg-indigo-50 dark:bg-indigo-900/20 text-echo" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                        )}>
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
