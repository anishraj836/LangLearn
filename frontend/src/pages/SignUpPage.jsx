import { useState } from "react";
import { AnchorIcon } from "lucide-react";
import { Link } from "react-router";

import useSignUp from "../hooks/useSignUp.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import { signup } from "../lib/api.js";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { isPending, mutate: signupMutation, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }
  });
  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
    <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
      {/* SIGNUP FORM - LEFT SIDE */}
      <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
        {/* LOGO */}
        <div className="mb-4 flex items-center justify-start gap-2">
          <AnchorIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            LangLearn
          </span>
        </div>
        {/* ERROR MESSAGE IF ANY */}
        {error && (
          <div className="alert alert-error shadow-lg mb-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error.response?.data?.message || "An error occurred. Please try again."}</span>
            </div>
          </div>
        )}
        <div className="w-full">
          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Create an Account</h2>
                <p>Join LangLearn and start you Language Learning Journey today</p>
              </div>
              <div className="space-y-3">
                {/* fullName */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="input input-bordered w-full"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                  />
                </div>
                {/* email */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="John@gmail.com"
                    className="input input-bordered w-full"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                {/* password */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="********"
                    className="input input-bordered w-full"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                  <p className="text-xs opacity-70 mt-1">
                    Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.
                  </p>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      required
                    />
                    <span className="text-primary hover:underline">terms of service</span> and{" "}
                    <span className="text-primary hover:underline">privacy policy</span>
                  </label>
                </div>
              </div>
              <button className="btn btn-primary w-full" type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
              <div className="text-center mt-4">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* SIGNUP IMAGE - RIGHT SIDE */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
        <div className="max-w-md p-8">
          {/* Illustration */}
          <div className="relative aspect-square max-w-sm mx-auto">
            <img
              src="/i.svg"
              alt="Two people from different countries smiling and shaking hands, surrounded by speech bubbles with greetings in various languages, set against a bright and welcoming background that conveys a friendly and inclusive atmosphere. No visible text in the illustration."
              className="w-full h-full"
            />
          </div>

          <div className="text-center space-y-3 mt-6">
            <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
            <p className="opacity-70">
              Practice conversations, make friends, and improve your language skills together
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
    ;
};

export default SignUpPage;