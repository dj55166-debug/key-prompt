import { useState } from "react";

function InputField({ label, type = "text", placeholder, value, onChange, icon }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder-gray-400"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {show ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function AuthScreen() {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (mode !== "forgot" && form.password.length < 6) e.password = "Min 6 characters";
    if (mode === "signup" && form.password !== form.confirm) e.confirm = "Passwords don't match";
    if (mode === "signup" && !agreed) e.agreed = "You must accept the terms";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "forgot") setSuccess(true);
    }, 1500);
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setSuccess(false);
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-black">K</span>
        </div>
        <span className="font-bold text-sm text-gray-900">Key Prompt</span>
      </div>

      <div className="flex-1 flex flex-col justify-center px-5 py-8 max-w-sm mx-auto w-full">

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200">
            <span className="text-white text-2xl font-black">K</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">
            {mode === "login" && "Welcome back"}
            {mode === "signup" && "Create account"}
            {mode === "forgot" && "Reset password"}
          </h1>
          <p className="text-sm text-gray-500">
            {mode === "login" && "Sign in to your Key Prompt account"}
            {mode === "signup" && "Join thousands of prompt creators"}
            {mode === "forgot" && "We'll send you a reset link"}
          </p>
        </div>

        {/* Success state for forgot */}
        {success && mode === "forgot" ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-emerald-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m6-.75a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-semibold text-emerald-800 mb-1">Email sent!</p>
            <p className="text-sm text-emerald-600 mb-4">Check your inbox for a reset link.</p>
            <button onClick={() => switchMode("login")} className="text-sm font-semibold text-violet-600 hover:underline">
              Back to login
            </button>
          </div>
        ) : (
          <div className="space-y-4">

            {/* Google button */}
            {mode !== "forgot" && (
              <>
                <button className="w-full flex items-center justify-center gap-2.5 bg-white border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all shadow-sm">
                  <GoogleIcon />
                  Continue with Google
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              </>
            )}

            {/* Form fields */}
            <div className="space-y-3">
              {mode === "signup" && (
                <div>
                  <InputField
                    label="Full name"
                    placeholder="Awad"
                    value={form.name}
                    onChange={update("name")}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    }
                  />
                  {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <InputField
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update("email")}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  }
                />
                {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
              </div>

              {mode !== "forgot" && (
                <div>
                  <InputField
                    label="Password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={update("password")}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    }
                  />
                  {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <InputField
                    label="Confirm password"
                    type="password"
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={update("confirm")}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    }
                  />
                  {errors.confirm && <p className="text-xs text-rose-500 mt-1">{errors.confirm}</p>}
                </div>
              )}
            </div>

            {/* Forgot password link */}
            {mode === "login" && (
              <div className="text-right -mt-1">
                <button onClick={() => switchMode("forgot")} className="text-xs text-violet-600 font-medium hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms checkbox */}
            {mode === "signup" && (
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="mt-0.5 accent-violet-600 w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    I agree to the{" "}
                    <span className="text-violet-600 font-medium">Terms of Service</span>{" "}
                    and{" "}
                    <span className="text-violet-600 font-medium">Privacy Policy</span>
                  </span>
                </label>
                {errors.agreed && <p className="text-xs text-rose-500 mt-1">{errors.agreed}</p>}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-60 transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-violet-200 mt-1"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {mode === "login" ? "Signing in..." : mode === "signup" ? "Creating account..." : "Sending..."}
                </>
              ) : (
                <>
                  {mode === "login" && "Sign in"}
                  {mode === "signup" && "Create account"}
                  {mode === "forgot" && "Send reset link"}
                </>
              )}
            </button>

            {/* Switch mode */}
            <p className="text-center text-xs text-gray-500 pt-1">
              {mode === "login" && (
                <>Don't have an account?{" "}
                  <button onClick={() => switchMode("signup")} className="text-violet-600 font-semibold hover:underline">Sign up free</button>
                </>
              )}
              {mode === "signup" && (
                <>Already have an account?{" "}
                  <button onClick={() => switchMode("login")} className="text-violet-600 font-semibold hover:underline">Sign in</button>
                </>
              )}
              {mode === "forgot" && (
                <>Remember your password?{" "}
                  <button onClick={() => switchMode("login")} className="text-violet-600 font-semibold hover:underline">Back to login</button>
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center pb-6 px-4">
        <p className="text-[11px] text-gray-400">
          © 2025 Key Prompt · Operated by Awad ·{" "}
          <span className="text-violet-500">dj55166@gmail.com</span>
        </p>
      </div>
    </div>
  );
}