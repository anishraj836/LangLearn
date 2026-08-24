import { useState } from "react";
import { ShipWheelIcon, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { demoLogin } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
  const queryClient = useQueryClient();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [demoLoading, setDemoLoading] = useState(false);

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      await demoLogin();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Welcome to LangLearnAI Demo!");
    } catch (err) {
      toast.error("Demo login failed.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950"
    >
      <div className="border border-purple-500/30 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-slate-900/90 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* LOGO */}
            <div className="mb-6 flex items-center justify-start gap-2.5">
              <ShipWheelIcon className="size-9 text-primary animate-spin-slow" />
              <span className="text-3xl font-extrabold font-mono bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-wider">
                LangLearn AI
              </span>
            </div>

            {/* ERROR MESSAGE DISPLAY */}
            {error && (
              <div className="alert alert-error mb-4 text-xs font-semibold">
                <span>{error.response?.data?.message || "Login failed"}</span>
              </div>
            )}

            <div className="w-full space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Sign in to practice speaking with your AI Tutor & match with native partners.
                </p>
              </div>

              {/* 1-CLICK DEMO LOGIN BUTTON */}
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="btn bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white w-full font-bold border-none shadow-lg gap-2"
              >
                {demoLoading ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current text-amber-300" />
                    🚀 1-Click Instant Demo Login
                  </>
                )}
              </button>

              <div className="divider text-xs text-slate-500">OR LOG IN WITH EMAIL</div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="form-control w-full space-y-1">
                  <label className="label text-xs font-semibold text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="alex@example.com"
                    className="input input-bordered w-full text-xs bg-slate-800/60 border-slate-700 text-white"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control w-full space-y-1">
                  <label className="label text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full text-xs bg-slate-800/60 border-slate-700 text-white"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full font-bold shadow-md"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-400 font-bold hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* HERO IMAGE / PROMO SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900 p-10 flex-col justify-between border-l border-white/5">
          <div className="space-y-6">
            <span className="badge badge-primary font-extrabold text-xs">✨ AI-POWERED LANGUAGE ACADEMY</span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Master Speaking Fluency Before Matching with Native Humans
            </h2>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Experience zero-judgment AI voice practice, instant grammar feedback cards, adaptive readiness tracks, and Hinge-style 98% compatible matchmaking.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 text-xs">
            <div className="font-bold text-amber-300">🌟 Live Demo Mode Included</div>
            <div className="text-slate-300">
              Click <strong>Instant Demo Login</strong> to explore pre-seeded native language partners, AI speaking studio, and peer tutor certification!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;