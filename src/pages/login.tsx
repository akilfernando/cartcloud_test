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

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(){
        console.log(email, password);
        //TODO: login logic

    }

    return (
        <>
            <Header />
            <main className="flex min-h-screen items-center justify-center">
                <Card className="w-full max-w-md mb-30">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center">Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="e@example.com"
                                        required
                                        onChange={(e) => {setEmail(e.target.value)}}
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
                                    <Input type="password" required placeholder="Enter Password" onChange={(e) => {setPassword(e.target.value)}}/>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button className="w-full" onClick={handleLogin}>
                            Login
                        </Button>
                        <CardAction className="text-sm">Don't have an account?<Button className="ps-2" variant="link" onClick={() => navigate("/signup")}>Sign Up</Button></CardAction>
                    </CardFooter>
                </Card>
            </main>
        </>
    )
}