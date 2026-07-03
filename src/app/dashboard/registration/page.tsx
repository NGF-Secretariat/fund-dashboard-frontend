// "use client";

// import { useState } from "react";
// import toast from "react-hot-toast";
// import { register } from "@/app/lib/user";

// type Role = "admin" | "audit" | "user" | "acct";

// const ROLES: { value: Role; label: string; description: string }[] = [
//   {
//     value: "admin",
//     label: "Admin",
//     description: "Full access to all features",
//   },
//   { value: "audit", label: "Audit", description: "Can view and audit records" },
//   { value: "user", label: "User", description: "Standard user access" },
//   {
//     value: "acct",
//     label: "Accountant",
//     description: "Can manage financial records",
//   },
// ];

// interface RegisterDto {
//   name: string;
//   email: string;
//   password: string;
//   role: Role;
// }

// export default function RegisterPage() {
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [form, setForm] = useState<RegisterDto>({
//     name: "",
//     email: "",
//     password: "",
//     role: "user",
//   });
//   const [errors, setErrors] = useState<Partial<RegisterDto>>({});

//   const validate = (): boolean => {
//     const newErrors: Partial<RegisterDto> = {};
//     if (!form.name.trim()) newErrors.name = "Name is required";
//     if (!form.email.trim()) newErrors.email = "Email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
//       newErrors.email = "Enter a valid email address";
//     if (!form.password) newErrors.password = "Password is required";
//     else if (form.password.length < 8)
//       newErrors.password = "Password must be at least 8 characters";
//     if (!form.role) newErrors.role = "Role is required" as Role;
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       const response = await register(form);
//       if (!response.success) {
//         toast.error(
//           response.message || "Failed to create account. Please try again.",
//         );
//         return;
//       }
//       toast.success("Account created successfully");
//     } catch (error) {
//       toast.error("Failed to create account. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-700 mb-4">
//             <svg
//               className="w-6 h-6 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//               />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-green-800">
//             Create an account
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Fill in the details below to register a new user
//           </p>
//         </div>

//         {/* Card */}
//         <div className="bg-white rounded-xl shadow border border-green-100 p-8">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Full name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="e.g. Amina Bello"
//                 className={`w-full px-3 py-2 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.name ? "border-red-400" : "border-green-300"
//                 }`}
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-xs mt-1">{errors.name}</p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email address
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="e.g. amina@example.com"
//                 className={`w-full px-3 py-2 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.email ? "border-red-400" : "border-green-300"
//                 }`}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Minimum 8 characters"
//                   className={`w-full px-3 py-2 pr-10 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                     errors.password ? "border-red-400" : "border-green-300"
//                   }`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((p) => !p)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   tabIndex={-1}
//                 >
//                   {showPassword ? (
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                       />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//               )}
//             </div>

//             {/* Role */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Role
//               </label>
//               <select
//                 name="role"
//                 value={form.role}
//                 onChange={handleChange}
//                 className={`w-full px-3 py-2 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   errors.role ? "border-red-400" : "border-green-300"
//                 }`}
//               >
//                 {ROLES.map((r) => (
//                   <option key={r.value} value={r.value}>
//                     {r.label}
//                   </option>
//                 ))}
//               </select>
//               {/* Role description hint */}
//               <p className="text-xs text-gray-400 mt-1">
//                 {ROLES.find((r) => r.value === form.role)?.description}
//               </p>
//               {errors.role && (
//                 <p className="text-red-500 text-xs mt-1">{errors.role}</p>
//               )}
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-medium py-2.5 px-4 rounded-md transition-colors mt-2"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg
//                     className="animate-spin h-4 w-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8z"
//                     />
//                   </svg>
//                   Creating account...
//                 </span>
//               ) : (
//                 "Create account"
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Footer link */}
//         <p className="text-center text-sm text-gray-500 mt-6">
//           Already have an account?{" "}
//           <a
//             href="/login"
//             className="text-green-700 font-medium hover:underline"
//           >
//             Sign in
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { register, resetPassword } from "@/app/lib/user";

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

export default function RegisterPage() {
  const [view, setView] = useState<View>("register");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<RegisterDto>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [resetForm, setResetForm] = useState<ResetDto>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterDto>>({});
  const [resetErrors, setResetErrors] = useState<Partial<ResetDto>>({});

  const validate = (): boolean => {
    const newErrors: Partial<RegisterDto> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!form.role) newErrors.role = "Role is required" as Role;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReset = (): boolean => {
    const newErrors: Partial<ResetDto> = {};
    if (!resetForm.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetForm.email))
      newErrors.email = "Enter a valid email address";
    if (!resetForm.password) newErrors.password = "New password is required";
    else if (resetForm.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
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
    setLoading(true);
    try {
      const response = await register(form);
      if (!response.success) {
        toast.error(response.message || "Failed to create account. Please try again.");
        return;
      }
      toast.success("Account created successfully");
    } catch {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validateReset()) return;
    setLoading(true);
    try {
      // await resetPassword(resetForm);  ← wire up your API call here
      const reset = await resetPassword(resetForm);
      if (!reset.success) {
        toast.error(reset.message || "Failed to reset password. Please try again.");
        return;
      }
      toast.success("Password reset successfully");
      setView("register");
      setResetForm({ email: "", password: "" });
    } catch {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-700 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {view === "reset" ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              )}
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-800">
            {view === "reset" ? "Reset password" : "Create an account"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {view === "reset"
              ? "Enter the user's email and set a new password"
              : "Fill in the details below to register a new user"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow border border-green-100 p-8">

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role" value={form.role} onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md border bg-green-50 text-black focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.role ? "border-red-400" : "border-green-300"}`}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {ROLES.find((r) => r.value === form.role)?.description}
                </p>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit" disabled={loading}
                  className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Creating...
                    </span>
                  ) : "Create account"}
                </button>

                <button
                  type="button"
                  onClick={() => { setView("reset"); setResetErrors({}); }}
                  className="flex-1 border border-green-700 text-green-700 hover:bg-green-50 font-medium py-2.5 px-4 rounded-md transition-colors"
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

              <div className="flex gap-3 pt-1">
                <button
                  type="submit" disabled={loading}
                  className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Resetting...
                    </span>
                  ) : "Reset password"}
                </button>

                <button
                  type="button"
                  onClick={() => { setView("register"); setShowPassword(false); }}
                  className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-green-700 font-medium hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}