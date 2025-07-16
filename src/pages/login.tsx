import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "@/components/footer";
import { IoCartOutline } from "react-icons/io5";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAuth } from "@/context/authContext";
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [error, setError] = useState<string | null>("");

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .required("Password is required"),
    });

    useEffect(() => {
        if (user && localStorage.getItem("token")) {
            navigate("/product-listing");
        }
    }, [user, navigate]);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: handleLogin,
    });

    async function handleLogin(values: any) {
        const { email, password } = values;
        try {
            await login(email, password);
            navigate("/product-listing");
        } catch (error : any) {
            console.log(error.message);
            setError(error.message);
        }
    }

    return (
        <>
            <main className="flex h-screen items-center justify-center flex-col gap-1 w-full px-2 pt-4 pb-2">
                <IoCartOutline className="text-lg scale-300 2xl:scale-600 mb-3 2xl:mb-5" />
                <h1 className="text-4xl 2xl:text-5xl font-normal mt-3 2xl:mt-5">Cart Cloud</h1>
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
                            >
                                Sign In
                            </Button>
                        </div>
                        <p className="text-red-500 text-xs">{error}</p>
                        <div className="flex items-center justify-center text-sm">
                            Don't have an account?
                            <Button type="button" className="ps-1 text-blue-500" variant="link" onClick={() => navigate("/signup")}>
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </form>
            </main>
        </>
    )
}