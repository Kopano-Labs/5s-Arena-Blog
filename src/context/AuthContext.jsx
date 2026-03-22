import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

// Set your Google Client ID here or in .env as VITE_GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const DEFAULT_USERS = [
  { id: "admin-1", name: "Admin", email: "admin@5sarena.com", password: "admin123", role: "admin", image: "/authors/Jackson Wayne.png", username: "admin", autoVideoPlay: true, createdAt: "2026-01-01T00:00:00Z" },
];

function loadUsers() {
  const stored = localStorage.getItem("5s_users");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("5s_users", JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

function saveUsers(users) {
  localStorage.setItem("5s_users", JSON.stringify(users));
}

function loadAuthorApplications() {
  const stored = localStorage.getItem("5s_author_apps");
  return stored ? JSON.parse(stored) : [];
}

function saveAuthorApplications(apps) {
  localStorage.setItem("5s_author_apps", JSON.stringify(apps));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [authorApps, setAuthorApps] = useState([]);

  useEffect(() => {
    setUsers(loadUsers());
    setAuthorApps(loadAuthorApplications());
    const stored = localStorage.getItem("5s_current_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    }
  }, []);

  const login = (email, password) => {
    const allUsers = loadUsers();
    const found = allUsers.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Invalid email or password." };
    localStorage.setItem("5s_current_user", JSON.stringify(found));
    setUser(found);
    return { success: true };
  };

  const register = (name, email, password) => {
    const allUsers = loadUsers();
    if (allUsers.find((u) => u.email === email)) {
      return { success: false, error: "Email already registered." };
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: "reader",
      image: "",
      username: "",
      autoVideoPlay: true,
      createdAt: new Date().toISOString(),
    };
    const updated = [...allUsers, newUser];
    saveUsers(updated);
    setUsers(updated);
    localStorage.setItem("5s_current_user", JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const googleLogin = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { name, email, picture, sub } = decoded;
      const allUsers = loadUsers();
      let found = allUsers.find((u) => u.email === email);
      if (found) {
        // Existing user — update image from Google if empty
        if (!found.image && picture) {
          found.image = picture;
          saveUsers(allUsers);
        }
        localStorage.setItem("5s_current_user", JSON.stringify(found));
        setUser(found);
        return { success: true };
      }
      // New user via Google
      const newUser = {
        id: `google-${sub}`,
        name,
        email,
        password: "",
        role: "reader",
        image: picture || "",
        username: name?.toLowerCase().replace(/\s+/g, "") || "",
        autoVideoPlay: true,
        provider: "google",
        createdAt: new Date().toISOString(),
      };
      const updated = [...allUsers, newUser];
      saveUsers(updated);
      setUsers(updated);
      localStorage.setItem("5s_current_user", JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch {
      return { success: false, error: "Google sign-in failed." };
    }
  };

  const logout = () => {
    localStorage.removeItem("5s_current_user");
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return;
    const allUsers = loadUsers();
    const idx = allUsers.findIndex((u) => u.id === user.id);
    if (idx === -1) return;
    const updated = { ...allUsers[idx], ...updates };
    allUsers[idx] = updated;
    saveUsers(allUsers);
    setUsers(allUsers);
    localStorage.setItem("5s_current_user", JSON.stringify(updated));
    setUser(updated);
  };

  const applyForAuthor = (application) => {
    const apps = loadAuthorApplications();
    const newApp = { ...application, id: `app-${Date.now()}`, userId: user?.id, userName: user?.name, userEmail: user?.email, status: "pending", createdAt: new Date().toISOString() };
    const updated = [...apps, newApp];
    saveAuthorApplications(updated);
    setAuthorApps(updated);
  };

  const approveAuthor = (appId) => {
    const apps = loadAuthorApplications();
    const idx = apps.findIndex((a) => a.id === appId);
    if (idx === -1) return;
    apps[idx].status = "approved";
    saveAuthorApplications(apps);
    setAuthorApps([...apps]);
    // Update user role
    const allUsers = loadUsers();
    const userIdx = allUsers.findIndex((u) => u.id === apps[idx].userId);
    if (userIdx !== -1) {
      allUsers[userIdx].role = "author";
      saveUsers(allUsers);
      setUsers([...allUsers]);
    }
  };

  const rejectAuthor = (appId) => {
    const apps = loadAuthorApplications();
    const idx = apps.findIndex((a) => a.id === appId);
    if (idx === -1) return;
    apps[idx].status = "rejected";
    saveAuthorApplications(apps);
    setAuthorApps([...apps]);
  };

  const isAdmin = user?.role === "admin";
  const isAuthor = user?.role === "author" || user?.role === "admin";

  const value = useMemo(() => ({
    user, users, isAdmin, isAuthor, authorApps,
    login, register, googleLogin, logout, updateProfile,
    applyForAuthor, approveAuthor, rejectAuthor,
  }), [user, users, isAdmin, isAuthor, authorApps]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
