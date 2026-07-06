"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { register, resetPassword, loadUser, updateUser, deleteUser } from "@/app/lib/user";
import ConfirmPrompt from "@/app/components/ConfirmPrompt";

type Role = "admin" | "audit" | "user" | "acct";
type View = "register" | "reset";

const ROLES: { value: Role; label: string; description: string }[] = [
  { value: "admin", label: "Admin", description: "Full access to all features" },
  { value: "audit", label: "Audit", description: "Can view and audit records" },
  { value: "user", label: "User", description: "Standard user access" },
  { value: "acct", label: "Accountant", description: "Can manage financial records" },
];

interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: Role;
}

interface ResetDto {
  email: string;
  password: string;
}

interface RegisterFormState extends RegisterDto {
  confirmPassword: string;
}

interface ResetFormState extends ResetDto {
  confirmPassword: string;
}

export default function RegisterPage() {
  const [view, setView] = useState<View>("register");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [resetForm, setResetForm] = useState<ResetFormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterFormState>>({});
  const [resetErrors, setResetErrors] = useState<Partial<ResetFormState>>({});

  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [confirmConfig, setConfirmConfig] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await loadUser();
      if (res.success && res.data && res.data.success) {
        setUsers(res.data.data);
      } else {
        toast.error("Failed to load users list");
      }
    } catch {
      toast.error("Failed to load users list");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (userId: number | string, userName: string, newRole: Role) => {
    setConfirmConfig({
      message: `Are you sure you want to change the role of "${userName}" to "${newRole}"?`,
      onConfirm: async () => {
        try {
          const res = await updateUser(userId, { role: newRole });
          if (res.success) {
            toast.success(`Role updated to ${newRole} successfully`);
            fetchUsers();
          } else {
            toast.error(res.message || "Failed to update role");
            fetchUsers();
          }
        } catch {
          toast.error("Failed to update role");
          fetchUsers();
        } finally {
          setConfirmConfig(null);
        }
      }
    });
  };

  const handleResetPasswordClick = (email: string, userName: string) => {
    // Prefill the reset password form with the user's email
    setView("reset");
    setResetForm({
      email: email,
      password: "",
      confirmPassword: "",
    });
    // Clear any reset errors
    setResetErrors({});
    // Scroll to top to focus on the form
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success(`Prefilled email: ${email}`);
  };

  const handleDeleteUserClick = (userId: number | string, userName: string) => {
    setConfirmConfig({
      message: `Are you sure you want to permanently delete user "${userName}"? This action cannot be undone.`,
      onConfirm: async () => {
        setLoading(true);
        try {
          const res = await deleteUser(userId);
          if (res.success) {
            toast.success(`User "${userName}" deleted successfully`);
            fetchUsers();
          } else {
            toast.error(res.message || "Failed to delete user");
          }
        } catch {
          toast.error("Failed to delete user");
        } finally {
          setLoading(false);
          setConfirmConfig(null);
        }
      }
    });
  };

  const validate = (): boolean => {
    const newErrors: Partial<RegisterFormState> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.role) newErrors.role = "Role is required" as Role;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReset = (): boolean => {
    const newErrors: Partial<ResetFormState> = {};
    if (!resetForm.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetForm.email))
      newErrors.email = "Enter a valid email address";
    if (!resetForm.password) newErrors.password = "New password is required";
    else if (resetForm.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!resetForm.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (resetForm.password !== resetForm.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setResetErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetForm((prev) => ({ ...prev, [name]: value }));
    setResetErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setConfirmConfig({
      message: `Are you sure you want to create an account for "${form.name}" (${form.email})?`,
      onConfirm: async () => {
        setLoading(true);
        try {
          const { confirmPassword, ...registerData } = form;
          const response = await register(registerData);
          if (!response.success) {
            toast.error(response.message || "Failed to create account. Please try again.");
            return;
          }
          toast.success("Account created successfully");
          setForm({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "user",
          });
          fetchUsers();
        } catch {
          toast.error("Failed to create account. Please try again.");
        } finally {
          setLoading(false);
          setConfirmConfig(null);
        }
      }
    });
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validateReset()) return;

    setConfirmConfig({
      message: `Are you sure you want to reset the password for ${resetForm.email}?`,
      onConfirm: async () => {
        setLoading(true);
        try {
          const { confirmPassword, ...resetData } = resetForm;
          const reset = await resetPassword(resetData);
          if (!reset.success) {
            toast.error(reset.message || "Failed to reset password. Please try again.");
            return;
          }
          toast.success("Password reset successfully");
          setView("register");
          setResetForm({ email: "", password: "", confirmPassword: "" });
        } catch {
          toast.error("Failed to reset password. Please try again.");
        } finally {
          setLoading(false);
          setConfirmConfig(null);
        }
      }
    });
  };

  const PasswordToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      tabIndex={-1}
    >
      {show ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      case "acct":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "audit":
        return "bg-sky-100 text-sky-700 border border-sky-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-rose-50 text-rose-700 border border-rose-100";
      case "acct":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "audit":
        return "bg-sky-50 text-sky-700 border border-sky-100";
      case "user":
        return "bg-yellow-50 text-yellow-700 border border-yellow-700";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100";
    }
  };

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const acctCount = users.filter((u) => u.role === "acct").length;
  const auditCount = users.filter((u) => u.role === "audit").length;
  const viewsCount = users.filter((u) => u.role === "user").length;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedUsers = [...filteredUsers].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-black">
      {/* Confirm Prompt Modal */}
      {confirmConfig && (
        <ConfirmPrompt
          message={confirmConfig.message}
          onConfirm={confirmConfig.onConfirm}
          onClose={() => {
            setConfirmConfig(null);
            fetchUsers(); // Refresh on cancel to revert the select dropdown values
          }}
        />
      )}

      {/* Header and Page Title */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-800">User Administration</h1>
          <p className="text-sm text-gray-500">Manage user accounts, roles, permissions, and passwords</p>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-green-900 mt-1">{totalUsers}</h3>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Admins</p>
              <h3 className="text-2xl font-bold text-rose-900 mt-1">{adminCount}</h3>
            </div>
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Accountants</p>
              <h3 className="text-2xl font-bold text-emerald-900 mt-1">{acctCount}</h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Auditors</p>
              <h3 className="text-2xl font-bold text-sky-900 mt-1">{auditCount}</h3>
            </div>
            <div className="p-3 rounded-lg bg-sky-50 text-sky-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Views</p>
              <h3 className="text-2xl font-bold text-sky-900 mt-1">{viewsCount}</h3>
            </div>
            <div className="p-3 rounded-lg bg-sky-50 text-sky-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Register/Reset forms */}
        <div className="lg:col-span-5 w-full bg-white rounded-xl shadow border border-green-100 p-8">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-700">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {view === "reset" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                )}
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-green-800 text-center mb-1">
            {view === "reset" ? "Reset Password" : "Create Account"}
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            {view === "reset"
              ? "Enter user's email and confirmation details below"
              : "Register a new user inside the system"}
          </p>

          {/* ── Register form ── */}
          {view === "register" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. Amina Bello"
                  className={`w-full px-3 py-2 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? "border-red-400" : "border-green-300"}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="e.g. amina@example.com"
                  className={`w-full px-3 py-2 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.email ? "border-red-400" : "border-green-300"}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} name="password"
                    value={form.password} onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    className={`w-full px-3 py-2 pr-10 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.password ? "border-red-400" : "border-green-300"}`}
                  />
                  <PasswordToggle show={showPassword} onToggle={() => setShowPassword((p) => !p)} />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                    value={form.confirmPassword} onChange={handleChange}
                    placeholder="Repeat your password"
                    className={`w-full px-3 py-2 pr-10 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.confirmPassword ? "border-red-400" : "border-green-300"}`}
                  />
                  <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword((p) => !p)} />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role" value={form.role} onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.role ? "border-red-400" : "border-green-300"}`}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1 font-normal">
                  {ROLES.find((r) => r.value === form.role)?.description}
                </p>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit" disabled={loading}
                  className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                >
                  {loading ? "Creating..." : "Create account"}
                </button>

                <button
                  type="button"
                  onClick={() => { setView("reset"); setResetErrors({}); setShowPassword(false); setShowConfirmPassword(false); }}
                  className="flex-1 border border-green-700 text-green-700 hover:bg-green-50 font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                >
                  Reset password
                </button>
              </div>
            </form>
          )}

          {/* ── Reset password form ── */}
          {view === "reset" && (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email" name="email" value={resetForm.email} onChange={handleResetChange}
                  placeholder="User's email address"
                  className={`w-full px-3 py-2 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${resetErrors.email ? "border-red-400" : "border-green-300"}`}
                />
                {resetErrors.email && <p className="text-red-500 text-xs mt-1">{resetErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} name="password"
                    value={resetForm.password} onChange={handleResetChange}
                    placeholder="Minimum 8 characters"
                    className={`w-full px-3 py-2 pr-10 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${resetErrors.password ? "border-red-400" : "border-green-300"}`}
                  />
                  <PasswordToggle show={showPassword} onToggle={() => setShowPassword((p) => !p)} />
                </div>
                {resetErrors.password && <p className="text-red-500 text-xs mt-1">{resetErrors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                    value={resetForm.confirmPassword} onChange={handleResetChange}
                    placeholder="Repeat your new password"
                    className={`w-full px-3 py-2 pr-10 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${resetErrors.confirmPassword ? "border-red-400" : "border-green-300"}`}
                  />
                  <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword((p) => !p)} />
                </div>
                {resetErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{resetErrors.confirmPassword}</p>}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit" disabled={loading}
                  className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                >
                  {loading ? "Resetting..." : "Reset password"}
                </button>

                <button
                  type="button"
                  onClick={() => { setView("register"); setShowPassword(false); setShowConfirmPassword(false); }}
                  className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Registered Users Sidebar */}
        <div className="lg:col-span-7 w-full bg-white rounded-xl shadow border border-green-100 p-6 self-stretch">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-green-50 gap-4">
            <div>
              <h2 className="text-lg font-bold text-green-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Registered Users ({totalUsers})
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 font-normal">Active accounts in the system</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Box */}
              <div className="relative shrink-0 w-48 md:w-56">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-green-50/50 border border-green-200 text-xs px-3 py-1.5 pl-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 placeholder-gray-400"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchUsers}
                disabled={usersLoading}
                className="p-1.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 disabled:text-gray-300 transition-colors cursor-pointer shrink-0"
                title="Refresh list"
              >
                <svg className={`w-4 h-4 ${usersLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 9H18.06" />
                </svg>
              </button>
            </div>
          </div>

          {usersLoading && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <svg className="animate-spin h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-sm">Fetching registry...</span>
            </div>
          ) : sortedUsers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">No users found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[560px] overflow-y-auto pr-1.5 scrollbar-thin">
              {sortedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col p-4 rounded-xl border border-green-50 bg-green-50/5 hover:bg-green-50/20 hover:border-green-100 hover:shadow-sm transition-all gap-4 sm:flex-row sm:items-center justify-between"
                >
                  {/* User Profile Info */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${getAvatarStyle(user.role)}`}>
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-green-900 leading-snug">{user.name}</h4>
                      <p className="text-xs text-gray-400 font-normal leading-none mt-0.5">{user.email}</p>
                      <span className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border ${getRoleBadgeStyle(user.role)}`}>
                        {user.role === "acct" ? "Accountant" : user.role}
                      </span>
                    </div>
                  </div>

                  {/* User Action Tools */}
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <div className="flex flex-col">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Role</label>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, user.name, e.target.value as Role)}
                        className="bg-white border border-green-200 text-xs text-green-800 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500 font-medium cursor-pointer shadow-sm hover:border-green-300 transition-colors"
                      >
                        {ROLES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => handleResetPasswordClick(user.email, user.name)}
                      className="mt-4 flex items-center gap-1.5 text-xs bg-green-700 hover:bg-green-800 text-white font-medium px-3.5 py-1.5 rounded-md transition-all shadow-sm cursor-pointer hover:shadow"
                      title="Reset user password"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Reset Pass
                    </button>

                    <button
                      onClick={() => handleDeleteUserClick(user.id, user.name)}
                      className="mt-4 flex items-center gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-medium px-3.5 py-1.5 rounded-md transition-all shadow-sm cursor-pointer hover:shadow"
                      title="Delete user account"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}