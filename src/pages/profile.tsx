import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { IoPersonOutline } from "react-icons/io5";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export default function Profile() {
    let { userId } = useParams<{ userId: string }>(); 
    // Using a placeholder userId for now
    userId = "68372ccebb5188f5a3c44def"

    const [user, setUser] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddressExpanded, setIsAddressExpanded] = useState(false);
    const [isVendorProfileExpanded, setIsVendorProfileExpanded] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            setUser(null);

            if (!userId) {
                setError("User ID is missing from the URL.");
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching user:", userId);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`);
                console.log("Response:", response.data);
                setUser(response.data);
                setIsAddressExpanded(false);
                setIsVendorProfileExpanded(false);
            } catch (err: any) {
                if (axios.isAxiosError(err) && err.response) {
                     if (err.response.status === 404) {
                         setError(`User with ID ${userId} not found.`);
                     } else {
                         setError(`Failed to fetch user data: ${err.response.status} ${err.response.statusText}`);
                     }
                } else {
                    setError(`Failed to fetch user data: ${err.message}`);
                }
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

    }, [userId]);

    const handleSave = async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/${user._id}`, user, {
            });
            console.log("Response:", response.data);
            setUser(response.data);
            setIsEditing(false);
            console.log("Profile saved successfully:", response.data);

        } catch (err: any) {
             if (axios.isAxiosError(err) && err.response) {
                 setError(`Failed to save profile: ${err.response.status} ${err.response.statusText}`);
             } else {
                setError(`Failed to save profile: ${err.message}`);
             }
            console.error("Error saving profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const idParts = id.split('.');

        setUser((prevUser : any) => {
            if (!prevUser) return null;

            if (idParts.length === 1) {
                return {
                    ...prevUser,
                    [id]: value,
                };
            } else if (idParts.length === 2) {
                const [parentKey, childKey] = idParts;
                const parentObject = prevUser[parentKey] || {};
                return {
                    ...prevUser,
                    [parentKey]: {
                        ...(parentObject as any),
                        [childKey]: value,
                    },
                };
            }
            return prevUser;
        });
    };

    const handleRoleChange = (value: string) => {
        setUser((prevUser : any) => {
            if (!prevUser) return null;
            return {
                ...prevUser,
                role: value,
            };
        });
    };

    const handleCheckboxChange = (checked: boolean) => {
         setUser( (prevUser : any) => {
            if (!prevUser || !prevUser.vendorProfile) return null;
            return {
                ...prevUser,
                vendorProfile: {
                    ...prevUser.vendorProfile,
                    isActive: checked,
                },
            };
        });
    };

    const toggleAddressExpanded = () => {
        setIsAddressExpanded(!isAddressExpanded);
    };

    const toggleVendorProfileExpanded = () => {
        setIsVendorProfileExpanded(!isVendorProfileExpanded);
    };


    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Loading profile...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center flex-col">
                <p className="text-red-500">Error: {error}</p>
            </main>
        );
    }

    if (!user) {
         return (
            <main className="flex min-h-screen items-center justify-center">
                <p>No user data available.</p>
            </main>
        );
    }


    return (
        <div className="flex flex-col min-h-screen">
            <Header page="profile" />
            <main className="flex-grow flex items-center justify-center flex-col gap-4 w-full px-2 pt-32 pb-6 overflow-y-auto">
                 <IoPersonOutline className="text-lg scale-100 xl:scale-300 mb-3 xl:mb-3 mt-2" />
                 <h1 className="text-xl md:text-2xl font-medium mb-0.5">User Profile</h1>
                    <Card className="w-full max-w-md mt-0.5">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>View and update your profile details.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={user.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={user.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={user.role}
                                onValueChange={handleRoleChange}
                                disabled
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="customer">Customer</SelectItem>
                                    <SelectItem value="vendor">Vendor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <div
                                className="flex items-center justify-between cursor-pointer mt-4"
                                onClick={toggleAddressExpanded}
                            >
                                <h3 className="text-lg font-semibold">Address</h3>
                                {isAddressExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                            </div>
                            {isAddressExpanded && (
                                <div className="grid gap-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="address.street">Street</Label>
                                        <Input
                                            id="address.street"
                                            value={user.address?.street || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address.city">City</Label>
                                        <Input
                                            id="address.city"
                                            value={user.address?.city || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address.province">Province</Label>
                                        <Input
                                            id="address.province"
                                            value={user.address?.province || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address.postalCode">Postal Code</Label>
                                        <Input
                                            id="address.postalCode"
                                            value={user.address?.postalCode || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address.country">Country</Label>
                                        <Input
                                            id="address.country"
                                            value={user.address?.country || ''}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {user.role === 'vendor' && (
                            <div className="grid gap-4 mt-4">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={toggleVendorProfileExpanded}
                                >
                                    <h3 className="text-lg font-semibold">Vendor Profile</h3>
                                    {isVendorProfileExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                                </div>
                                {isVendorProfileExpanded && (
                                    <div className="grid gap-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="vendorProfile.storeName">Store Name</Label>
                                            <Input
                                                id="vendorProfile.storeName"
                                                value={user.vendorProfile?.storeName || ''}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="vendorProfile.storeSlug">Store Slug</Label>
                                            <Input
                                                id="vendorProfile.storeSlug"
                                                value={user.vendorProfile?.storeSlug || ''}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="vendorProfile.isActive"
                                                checked={user.vendorProfile?.isActive || false}
                                                onCheckedChange={handleCheckboxChange}
                                                disabled={!isEditing}
                                            />
                                            <Label htmlFor="vendorProfile.isActive">Store Active</Label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </CardContent>
                    <CardFooter className="flex justify-end">
                        {isEditing ? (
                            <Button onClick={handleSave} disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        ) : (
                            <Button onClick={() => setIsEditing(true)} disabled={loading}>
                                Edit Profile
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </main>

            <Footer />
        </div>
    );
} 