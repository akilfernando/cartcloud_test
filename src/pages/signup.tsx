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

export default function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [name, setName] = useState("");

    async function handleSignup() {
        console.log(email, password, role, name);
        //TODO: login logic

    }

    return (
        <>
            <Header page="signup"/>
            <main className="flex min-h-screen items-center justify-center">
                <Card className="w-full max-w-md mb-30 border border-[var(--header-background)] pt-0">
                    <CardHeader className="bg-[var(--header-background)] rounded-t-md py-2">
                        <CardTitle className="text-3xl font-bold text-center text-white">Signup</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Name</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter your name"
                                        required
                                        onChange={(e) => { setName(e.target.value) }}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="e@example.com"
                                        required
                                        onChange={(e) => { setEmail(e.target.value) }}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input type="password" required placeholder="Enter Password" onChange={(e) => { setPassword(e.target.value) }} />
                                </div>
                                {/* TODO: get user to enter address or ask for location permissions? */}
                                <div className="grid gap-2">
                                    <RadioGroup defaultValue="customer" onValueChange={setRole}>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center">
                                                <RadioGroupItem value="customer" id="customer" />
                                                <Label htmlFor="customer" className="ml-2">Customer</Label>
                                            </div>
                                            <div className="flex items-center">
                                                <RadioGroupItem value="vendor" id="vendor" />
                                                <Label htmlFor="vendor" className="ml-2">Vendor</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button className="w-full  bg-[var(--header-background)] text-white hover:bg-[var(--header-background)]/90" onClick={handleSignup}>
                            Signup
                        </Button>
                        <CardAction className="text-sm">Already have an account?<Button className="ps-2" variant="link" onClick={() => navigate("/")}>Login</Button></CardAction>
                    </CardFooter>
                </Card>
            </main>
            <Footer />
        </>
    )
}