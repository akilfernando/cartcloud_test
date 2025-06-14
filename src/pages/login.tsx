import Header from "@/components/header";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
            <main className="flex min-h-screen items-center justify-center flex-col gap-12 w-full py-25">
                <IoCartOutline className="text-sm scale-700" />
                <h1 className="text-5xl font-normal">Cart Cloud</h1>
                <form className="w-1/4 ">
                    <div className="flex flex-col gap-5">
                        <div className="grid gap-2">
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
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input id="password" name="password" type="password" required placeholder="Enter Password" onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                        <div className="grid gap-2">
                            <Button className="bg-[var(--foreground)] text-white hover:bg-[var(--muted-foreground)]" onClick={handleLogin}>
                                Sign In
                            </Button>
                        </div>
                        <div className="flex items-center">
                            Don't have an account?
                            <Button className="ps-2 text-blue-500" variant="link" onClick={() => navigate("/signup")}>Sign Up</Button>
                        </div>
                    </div>
                </form>
            </main>
        </>
    )
}