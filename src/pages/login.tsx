import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "@/components/footer";
import { IoCartOutline } from "react-icons/io5";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        console.log(email, password);
        //TODO: login logic
    }

    return (
        <>
            <main className="flex h-screen items-center justify-center flex-col gap-1 w-full px-2 pt-4 pb-2">
                <IoCartOutline className="text-lg scale-300 2xl:scale-700 mb-1" />
                <h1 className="text-4xl 2xl:text-5xl font-normal mt-4">Cart Cloud</h1>
                <form className="w-full max-w-md">
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <div className="grid gap-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="e@example.com"
                                required
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter Password"
                                required
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Button className="w-full bg-[var(--foreground)] text-white hover:bg-[var(--muted-foreground)]" onClick={handleLogin}>
                                Sign In
                            </Button>
                        </div>
                        <div className="flex items-center justify-center text-sm">
                            Don't have an account?
                            <Button className="ps-1 text-blue-500" variant="link" onClick={() => navigate("/signup")}>
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </form>
            </main>
        </>
    )
}