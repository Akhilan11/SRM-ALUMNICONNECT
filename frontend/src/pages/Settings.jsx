import React, { useState, useEffect } from "react";
import { useTheme, daisyThemes } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Palette,
  LogOut,
  Bell,
  Moon,
  Sun,
  Eye,
  Save,
  Check,
  Shield,
  Volume2,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Settings as SettingsIcon,
  Monitor,
  Smartphone,
  Globe,
  Lock,
  User,
  ChevronRight,
} from "lucide-react";

export default function SettingPage() {
  const { currentTheme, changeTheme, themes, isDarkTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("appearance");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  // Settings states
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    pushNotifications: false,
    showOnlineStatus: true,
    twoFactorAuth: false,
    soundEffects: true,
    compactView: false,
    autoSave: true,
  });

  // Initialize from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    showNotification(`Setting updated successfully`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      showNotification("Failed to sign out", "error");
    }
  };

  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
    showNotification(`Theme changed to ${themeName}`);
  };

  const exportSettings = () => {
    const exportData = {
      theme: currentTheme,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "alumni-connect-settings.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification("Settings exported successfully");
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.theme) changeTheme(importedData.theme);
        if (importedData.settings) setSettings((prev) => ({ ...prev, ...importedData.settings }));
        showNotification("Settings imported successfully");
      } catch (error) {
        showNotification("Failed to import settings", "error");
      }
    };
    reader.readAsText(file);
  };

  const resetSettings = () => {
    setSettings({
      notifications: true,
      emailNotifications: true,
      pushNotifications: false,
      showOnlineStatus: true,
      twoFactorAuth: false,
      soundEffects: true,
      compactView: false,
      autoSave: true,
    });
    changeTheme("dark");
    showNotification("Settings reset to defaults");
  };

  // Group themes by category
  const lightThemes = themes.filter((t) => t.category === "light");
  const darkThemes = themes.filter((t) => t.category === "dark");

  return (
    <div className="min-h-screen bg-base-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="toast toast-top toast-end z-50"
          >
            <div className={`alert ${notification.type === "error" ? "alert-error" : "alert-success"}`}>
              <Check className="w-5 h-5" />
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-base-content">Settings</h1>
              <p className="text-base-content/60 mt-1">Manage your preferences and account settings</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportSettings} className="btn btn-outline btn-sm gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <label className="btn btn-outline btn-sm gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input type="file" accept=".json" onChange={importSettings} className="hidden" />
              </label>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 shrink-0"
          >
            <ul className="menu bg-base-100 rounded-box shadow-lg p-2">
              <li className="menu-title">
                <span>Settings</span>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("appearance")}
                  className={activeTab === "appearance" ? "active" : ""}
                >
                  <Palette className="w-5 h-5" />
                  Appearance
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={activeTab === "notifications" ? "active" : ""}
                >
                  <Bell className="w-5 h-5" />
                  Notifications
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("privacy")}
                  className={activeTab === "privacy" ? "active" : ""}
                >
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("preferences")}
                  className={activeTab === "preferences" ? "active" : ""}
                >
                  <SettingsIcon className="w-5 h-5" />
                  Preferences
                </button>
              </li>
              <li className="menu-title mt-4">
                <span>Account</span>
              </li>
              <li>
                <button onClick={handleLogout} className="text-error hover:bg-error/10">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                {/* Current Theme Card */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="card-title">Current Theme</h2>
                        <p className="text-base-content/60">
                          You're using the <span className="badge badge-primary">{currentTheme}</span> theme
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isDarkTheme() ? (
                          <Moon className="w-6 h-6 text-primary" />
                        ) : (
                          <Sun className="w-6 h-6 text-warning" />
                        )}
                      </div>
                    </div>

                    {/* Theme Preview */}
                    <div className="grid grid-cols-5 gap-2 p-4 bg-base-200 rounded-lg">
                      <div className="h-8 rounded bg-primary"></div>
                      <div className="h-8 rounded bg-secondary"></div>
                      <div className="h-8 rounded bg-accent"></div>
                      <div className="h-8 rounded bg-neutral"></div>
                      <div className="h-8 rounded bg-base-content"></div>
                    </div>
                  </div>
                </div>

                {/* Light Themes */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-4">
                      <Sun className="w-5 h-5 text-warning" />
                      <h2 className="card-title">Light Themes</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {lightThemes.map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => handleThemeChange(theme.name)}
                          className={`group relative overflow-hidden rounded-xl border-2 transition-all hover:scale-105 ${
                            currentTheme === theme.name
                              ? "border-primary ring-2 ring-primary/30"
                              : "border-base-300 hover:border-primary/50"
                          }`}
                          data-theme={theme.name}
                        >
                          <div className="bg-base-100 p-3">
                            <div className="flex gap-1 mb-2">
                              <div className="h-4 w-4 rounded-full bg-primary"></div>
                              <div className="h-4 w-4 rounded-full bg-secondary"></div>
                              <div className="h-4 w-4 rounded-full bg-accent"></div>
                            </div>
                            <div className="space-y-1">
                              <div className="h-2 w-full rounded bg-base-content/20"></div>
                              <div className="h-2 w-3/4 rounded bg-base-content/20"></div>
                            </div>
                          </div>
                          <div className="bg-base-200 px-3 py-2 text-center">
                            <span className="text-xs font-medium text-base-content">{theme.label}</span>
                          </div>
                          {currentTheme === theme.name && (
                            <div className="absolute top-1 right-1 bg-primary text-primary-content rounded-full p-1">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dark Themes */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-4">
                      <Moon className="w-5 h-5 text-primary" />
                      <h2 className="card-title">Dark Themes</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {darkThemes.map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => handleThemeChange(theme.name)}
                          className={`group relative overflow-hidden rounded-xl border-2 transition-all hover:scale-105 ${
                            currentTheme === theme.name
                              ? "border-primary ring-2 ring-primary/30"
                              : "border-base-300 hover:border-primary/50"
                          }`}
                          data-theme={theme.name}
                        >
                          <div className="bg-base-100 p-3">
                            <div className="flex gap-1 mb-2">
                              <div className="h-4 w-4 rounded-full bg-primary"></div>
                              <div className="h-4 w-4 rounded-full bg-secondary"></div>
                              <div className="h-4 w-4 rounded-full bg-accent"></div>
                            </div>
                            <div className="space-y-1">
                              <div className="h-2 w-full rounded bg-base-content/20"></div>
                              <div className="h-2 w-3/4 rounded bg-base-content/20"></div>
                            </div>
                          </div>
                          <div className="bg-base-200 px-3 py-2 text-center">
                            <span className="text-xs font-medium text-base-content">{theme.label}</span>
                          </div>
                          {currentTheme === theme.name && (
                            <div className="absolute top-1 right-1 bg-primary text-primary-content rounded-full p-1">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title mb-4">Notification Settings</h2>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-4 hover:bg-base-200 rounded-lg transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-base-content/60">Receive notifications in your browser</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={settings.notifications}
                        onChange={(e) => handleSettingChange("notifications", e.target.checked)}
                      />
                    </div>

                    <div className="divider my-0"></div>

                    <div className="flex items-center justify-between p-4 hover:bg-base-200 rounded-lg transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-secondary/10 p-3 rounded-lg">
                          <Globe className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-base-content/60">Receive updates via email</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-secondary"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                      />
                    </div>

                    <div className="divider my-0"></div>

                    <div className="flex items-center justify-between p-4 hover:bg-base-200 rounded-lg transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-accent/10 p-3 rounded-lg">
                          <Volume2 className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">Sound Effects</p>
                          <p className="text-sm text-base-content/60">Play sounds for notifications</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-accent"
                        checked={settings.soundEffects}
                        onChange={(e) => handleSettingChange("soundEffects", e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title mb-4">Privacy Settings</h2>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-4 hover:bg-base-200 rounded-lg transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="bg-success/10 p-3 rounded-lg">
                            <Eye className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <p className="font-medium">Show Online Status</p>
                            <p className="text-sm text-base-content/60">Let others see when you're online</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-success"
                          checked={settings.showOnlineStatus}
                          onChange={(e) => handleSettingChange("showOnlineStatus", e.target.checked)}
                        />
                      </div>

                      <div className="divider my-0"></div>

                      <div className="flex items-center justify-between p-4 hover:bg-base-200 rounded-lg transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="bg-warning/10 p-3 rounded-lg">
                            <Shield className="w-5 h-5 text-warning" />
                          </div>
                          <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-base-content/60">Add an extra layer of security</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-warning"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleSettingChange("twoFactorAuth", e.target.checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="card bg-error/5 border border-error/20 shadow-lg">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-4">
                      <Trash2 className="w-5 h-5 text-error" />
                      <h2 className="card-title text-error">Danger Zone</h2>
                    </div>
                    <p className="text-base-content/60 mb-4">
                      These actions are permanent and cannot be undone.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={resetSettings} className="btn btn-outline btn-error btn-sm">
                        Reset All Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title mb-4">App Preferences</h2>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-4 hover:bg-base-200 rounded-lg transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-info/10 p-3 rounded-lg">
                          <Save className="w-5 h-5 text-info" />
                        </div>
                        <div>
                          <p className="font-medium">Auto Save</p>
                          <p className="text-sm text-base-content/60">Automatically save your changes</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-info"
                        checked={settings.autoSave}
                        onChange={(e) => handleSettingChange("autoSave", e.target.checked)}
                      />
                    </div>

                    <div className="divider my-0"></div>

                    <div className="flex items-center justify-between p-4 hover:bg-base-200 rounded-lg transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-neutral/10 p-3 rounded-lg">
                          <EyeOff className="w-5 h-5 text-neutral-content" />
                        </div>
                        <div>
                          <p className="font-medium">Compact View</p>
                          <p className="text-sm text-base-content/60">Use a more condensed layout</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle"
                        checked={settings.compactView}
                        onChange={(e) => handleSettingChange("compactView", e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-base-content/40 text-sm">
            Settings are saved automatically • Version 2.0.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
