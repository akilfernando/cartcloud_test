import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { IoCartOutline } from "react-icons/io5";

import { useAuth } from "@/context/authContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Remove unused imports to keep the bundle size smaller
// import Header from "@/components/header";
// import Footer from "@/components/footer";
// import { useState } from "react"; // useState is not directly used for component state here

export default function Login() {
  const navigate = useNavigate();
  const { user, isLoading, login } = useAuth();
  const { addToast } = useToast();

  // Determine the user's role; default to 'customer' if user is not yet loaded or doesn't have a role
  const role = user?.role || "customer";

  // Define validation schema outside the component or memoize it
  // to prevent re-creation on every render.
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Use a more specific dependency array for useEffect to prevent unnecessary runs.
  // We only need to react when 'user' or 'isLoading' changes.
  useEffect(() => {
    // If user is authenticated and not currently loading, navigate based on role.
    // The localStorage check for "token" is redundant if `useAuth` reliably
    // indicates user presence based on token validation.
    if (user && !isLoading) {
      if (role === "vendor") {
        navigate("/vendor-home");
      } else {
        navigate("/home");
      }
    }
  }, [user, isLoading, navigate, role]); // Added 'role' to dependencies as it's used inside

  // Memoize handleLogin or define it as a stable function if not using formik directly
  // Formik handles function stability for onSubmit, so this is fine.
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        // After successful login, the useEffect above will handle navigation.
        // navigate("/") here might cause a brief flicker or redundant navigation
        // if the useEffect dependency array is already set up to handle it.
        // For this pattern, it's often cleaner to let useEffect manage all post-auth navigation.
        // If a specific post-login redirect to the root is always desired *before* role check,
        // you could keep it, but usually, the role-based navigation is the final destination.
      } catch (error: any) {
        console.error("Login error:", error); // Use console.error for errors
        addToast({
          title: "Login Failed",
          description: error.response?.data?.message || error.message || "An unexpected error occurred. Please try again.",
          variant: "error",
        });
      }
    },
  });

  // Show loading spinner while checking authentication status to improve UX.
  // This prevents the login form from flashing before redirection.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <main className="flex h-screen items-center justify-center flex-col gap-1 w-full px-2 pt-4 pb-2">
        <IoCartOutline className="text-lg scale-300 2xl:scale-600 mb-3 2xl:mb-5" />
        <h1 className="text-4xl 2xl:text-5xl font-normal mt-3 2xl:mt-5">
          Cart Cloud
        </h1>
        <form className="w-full max-w-md" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-xs">{formik.errors.email}</div>
              )}
            </div>
            <div className="grid gap-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-xs">{formik.errors.password}</div>
              )}
            </div>
            <div className="grid gap-1">
              <Button
                className="w-full bg-[var(--foreground)] text-white hover:bg-[var(--muted-foreground)]"
                type="submit"
                disabled={formik.isSubmitting} // Disable button during submission to prevent multiple clicks
              >
                Sign In
              </Button>
            </div>
            <div className="flex items-center justify-center text-sm">
              Don't have an account?
              <Button
                type="button"
                className="ps-1 text-blue-500"
                variant="link"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}