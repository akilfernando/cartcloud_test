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
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import { IoCartOutline } from "react-icons/io5";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [name, setName] = useState("");

    async function handleSignup() {
        console.log(email, password, role, name, confirmPassword);
        //TODO: signup logic

    }

    return (
        <>
            <main className="flex h-screen items-center justify-center flex-col gap-1 w-full px-2 pt-4 pb-2">
                <IoCartOutline className="text-lg scale-300 2xl:scale-600 mb-1 2xl:mb-5" />
                <h1 className="text-4xl 2xl:text-5xl font-normal mb-1 2xl:mt-5">Cart Cloud</h1>
                <form className="w-full max-w-md">
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <div className="grid gap-1">
                            <Label htmlFor="email">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                required
                                onChange={(e) => { setName(e.target.value) }}
                            />
                        </div>
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
                            <Label htmlFor="password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                placeholder="Confirm Password"
                                required
                                onChange={(e) => { setConfirmPassword(e.target.value) }}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger id="role" className="w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="customer">Customer</SelectItem>
                                    <SelectItem value="vendor">Vendor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-1">
                            <Button className="w-full bg-[var(--foreground)] text-white hover:bg-[var(--muted-foreground)]" onClick={handleSignup}>
                                Create Account
                            </Button>
                        </div>
                        <div className="flex items-center justify-center text-sm">
                            Already have an account?
                            <Button className="ps-1 text-blue-500" variant="link" onClick={() => navigate("/")}>
                                Login
                            </Button>
                        </div>
                    </div>
                </form>
            </main>
        </>
    )
}