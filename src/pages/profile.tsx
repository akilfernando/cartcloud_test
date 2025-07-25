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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { IoPersonOutline, IoCartOutline, IoStatsChartOutline, IoStorefrontOutline, IoPeopleOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from "@/context/authContext";
import { useToast } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDownIcon, ChevronUpIcon, Package, TrendingUp, Users, ShoppingCart, Star, CreditCard, MapPin, Key, Shield, BarChart3, Store, Plus, Eye, Edit, Trash2, Clock, XCircle } from "lucide-react";

// Mock data for demonstration
const mockOrderHistory = [
    { id: "ORD001", date: "2024-01-15", total: 129.99, status: "Delivered", items: ["Laptop Stand", "Wireless Mouse"] },
    { id: "ORD002", date: "2024-01-10", total: 89.50, status: "Shipped", items: ["Keyboard", "Mouse Pad"] },
    { id: "ORD003", date: "2024-01-05", total: 199.99, status: "Processing", items: ["Monitor", "HDMI Cable"] },
];



const mockVendorProducts = [
    { id: "P001", name: "Wireless Headphones", price: 79.99, stock: 25, sales: 150, status: "Active" },
    { id: "P002", name: "Phone Case", price: 29.99, stock: 0, sales: 89, status: "Out of Stock" },
    { id: "P003", name: "Tablet Stand", price: 39.99, stock: 12, sales: 67, status: "Active" },
];

const mockSalesData = {
    totalRevenue: 15487.50,
    totalOrders: 234,
    avgOrderValue: 66.15,
    conversionRate: 3.2,
    topProducts: [
        { name: "Wireless Headphones", sales: 150, revenue: 11998.50 },
        { name: "Phone Case", sales: 89, revenue: 2669.11 },
        { name: "Tablet Stand", sales: 67, revenue: 2679.33 },
    ]
};

const mockUserManagement = [
    { id: "U001", name: "John Doe", email: "john@example.com", role: "customer", status: "Active", joinDate: "2024-01-01" },
    { id: "U002", name: "Jane Smith", email: "jane@example.com", role: "vendor", status: "Active", joinDate: "2024-01-02" },
    { id: "U003", name: "Bob Johnson", email: "bob@example.com", role: "customer", status: "Suspended", joinDate: "2024-01-03" },
];

export default function Profile() {
    const { user: authUser } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    let { userId } = useParams<{ userId: string }>(); 
    
    // Use the authenticated user's ID if no userId in params
    if (!userId && authUser) {
        userId = authUser.id;
    }

    const [user, setUser] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [orderHistory, setOrderHistory] = useState<any[]>([]);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [cancelLoading, setCancelLoading] = useState<string | null>(null); // Track which order is being cancelled
    const [accountBalance, setAccountBalance] = useState<any>(null);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [balanceError, setBalanceError] = useState<string | null>(null);

    const getTabsForRole = (role: string) => {
        const baseTabs = [
            { id: "profile", label: "Profile", icon: IoPersonOutline },
            { id: "security", label: "Security", icon: IoShieldCheckmarkOutline },
        ];

        switch (role) {
            case "customer":
                return [
                    ...baseTabs,
                    { id: "orders", label: "Orders", icon: IoCartOutline },
                    { id: "balance", label: "Account Balance", icon: CreditCard },
                ];
            case "vendor":
                return [
                    ...baseTabs,
                    { id: "store", label: "Store", icon: IoStorefrontOutline },
                    { id: "products", label: "Products", icon: Package },
                    { id: "analytics", label: "Analytics", icon: IoStatsChartOutline },
                ];
            case "admin":
                return [
                    ...baseTabs,
                    { id: "users", label: "Users", icon: IoPeopleOutline },
                    { id: "system", label: "System", icon: BarChart3 },
                ];
            default:
                return baseTabs;
        }
    };

    // Handle initial tab from URL parameters
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && user) {
            const validTabs = getTabsForRole(user.role).map(tab => tab.id);
            if (validTabs.includes(tabParam)) {
                setActiveTab(tabParam);
            }
        }
    }, [searchParams, user]);

    // Handle tab changes and update URL
    const handleTabChange = (newTab: string) => {
        setActiveTab(newTab);
        // Update URL without triggering navigation
        const newParams = new URLSearchParams(searchParams);
        newParams.set('tab', newTab);
        setSearchParams(newParams, { replace: true });
    };

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            setUser(null);

            if (!userId) {
                setError("User not authenticated. Please log in to view your profile.");
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching user:", userId);
                const token = localStorage.getItem("token");
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log("Response:", response.data);
                setUser(response.data);
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
    }, [userId, authUser]);

    const fetchOrderHistory = async () => {
        if (!userId) return;
        
        setOrderLoading(true);
        setOrderError(null);
        
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log("Order history:", response.data);
            setOrderHistory(response.data);
        } catch (err: any) {
            console.error("Error fetching order history:", err);
            if (axios.isAxiosError(err) && err.response) {
                setOrderError(`Failed to fetch order history: ${err.response.status} ${err.response.statusText}`);
            } else {
                setOrderError(`Failed to fetch order history: ${err.message}`);
            }
        } finally {
            setOrderLoading(false);
        }
    };

    const fetchAccountBalance = async () => {
        if (!userId) return;
        
        setBalanceLoading(true);
        setBalanceError(null);
        
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}/account-balance`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log("Account balance:", response.data);
            setAccountBalance(response.data);
        } catch (err: any) {
            console.error("Error fetching account balance:", err);
            if (axios.isAxiosError(err) && err.response) {
                setBalanceError(`Failed to fetch account balance: ${err.response.status} ${err.response.statusText}`);
            } else {
                setBalanceError(`Failed to fetch account balance: ${err.message}`);
            }
        } finally {
            setBalanceLoading(false);
        }
    };

    // Fetch order history when user data is loaded and orders tab is active
    useEffect(() => {
        if (user && activeTab === "orders") {
            fetchOrderHistory();
        }
    }, [user, activeTab]);

    // Fetch account balance when user data is loaded and balance tab is active
    useEffect(() => {
        if (user && activeTab === "balance") {
            fetchAccountBalance();
        }
    }, [user, activeTab]);

    const handleCancelOrder = async (orderId: string, orderNumber: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to cancel order #${orderNumber}? This action cannot be undone.`
        );

        if (!confirmed) return;

        setCancelLoading(orderId);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/orders/${orderId}/cancel`,
                { reason: 'Customer requested cancellation' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Order cancelled:', response.data);

            // Update the order in the local state
            setOrderHistory(prevOrders => 
                prevOrders.map(order => 
                    order._id === orderId 
                        ? { ...order, status: 'cancelled', paymentStatus: response.data.order.paymentStatus }
                        : order
                )
            );

            addToast({
                title: 'Order Cancelled',
                description: response.data.refundInfo 
                    ? `Order #${orderNumber} has been cancelled. ${response.data.refundInfo.status}`
                    : `Order #${orderNumber} has been cancelled successfully.`,
                variant: 'success',
                duration: 6000
            });

        } catch (err: any) {
            console.error('Error cancelling order:', err);
            
            let errorMessage = 'Failed to cancel order. Please try again.';
            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
            }

            addToast({
                title: 'Cancellation Failed',
                description: errorMessage,
                variant: 'error',
                duration: 5000
            });
        } finally {
            setCancelLoading(null);
        }
    };

    const canCancelOrder = (status: string) => {
        const cancellableStatuses = ['pending', 'confirmed', 'processing'];
        return cancellableStatuses.includes(status.toLowerCase());
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/${user._id}`, user, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log("Response:", response.data);
            setUser(response.data);
            setIsEditing(false);
            console.log("Profile saved successfully:", response.data);
            
            // Show success toast
            addToast({
                title: "Profile Updated",
                description: "Your profile information has been successfully updated.",
                variant: "success",
                duration: 3000
            });
            
        } catch (err: any) {
            let errorMessage = "Failed to save profile. Please try again.";
            
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 400) {
                    errorMessage = err.response.data?.message || "Invalid profile data.";
                } else if (err.response.status === 401) {
                    errorMessage = "You are not authorized to update this profile.";
                } else {
                    errorMessage = `Failed to save profile: ${err.response.statusText}`;
                }
            }
            
            setError(errorMessage);
            addToast({
                title: "Profile Update Failed",
                description: errorMessage,
                variant: "error",
                duration: 5000
            });
            
            console.error("Error saving profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            const errorMessage = "Passwords do not match";
            addToast({
                title: "Password Validation Error",
                description: errorMessage,
                variant: "error",
                duration: 4000
            });
            return;
        }
        if (newPassword.length < 6) {
            const errorMessage = "Password must be at least 6 characters";
            addToast({
                title: "Password Validation Error",
                description: errorMessage,
                variant: "error",
                duration: 4000
            });
            return;
        }
        
        if (!user) {
            const errorMessage = "User not found";
            addToast({
                title: "Password Update Error",
                description: errorMessage,
                variant: "error",
                duration: 4000
            });
            return;
        }
        
        try {
            setLoading(true);
            
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/users/${user._id}/password`,
                { password: newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            
            console.log("Password changed successfully:", response.data);
            setNewPassword("");
            setConfirmPassword("");
            
            // Show success toast notification
            addToast({
                title: "Password Updated",
                description: "Your password has been successfully updated.",
                variant: "success",
                duration: 4000
            });
            
        } catch (err: any) {
            console.error("Error changing password:", err);
            let errorMessage = "Failed to change password. Please try again.";
            
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 400) {
                    errorMessage = err.response.data?.message || "Invalid password requirements.";
                } else if (err.response.status === 401) {
                    errorMessage = "You are not authorized to change this password.";
                } else {
                    errorMessage = `Failed to change password: ${err.response.statusText}`;
                }
            }
            
            addToast({
                title: "Password Update Failed",
                description: errorMessage,
                variant: "error",
                duration: 5000
            });
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

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header page="profile" />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mb-4"></div>
                        <p>Loading profile...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header page="profile" />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 text-lg">Error: {error}</p>
                        <Button onClick={() => window.location.reload()} className="mt-4">
                            Try Again
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header page="profile" />
                <main className="flex-grow flex items-center justify-center">
                    <p>No user data available.</p>
                </main>
                <Footer />
            </div>
        );
    }

    const tabs = getTabsForRole(user.role);

    return (
        <div className="flex flex-col min-h-screen">
            <Header page="profile" role={user.role} />
            <main className="flex-grow px-4 py-8 pt-24">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center mb-6">
                        <IoPersonOutline className="text-3xl mr-3" />
                        <div>
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <p className="text-gray-600 capitalize">{user.role} Dashboard</p>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <div className="flex justify-center mb-6">
                            <TabsList className="inline-flex">
                                {tabs.map((tab) => (
                                    <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                                        <tab.icon className="h-4 w-4" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {/* Profile Tab */}
                        <TabsContent value="profile" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>Manage your personal information and preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={user.name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={user.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Account Type</Label>
                                        <Select value={user.role} onValueChange={handleRoleChange} disabled>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="customer">Customer</SelectItem>
                                                <SelectItem value="vendor">Vendor</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Address Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            <h3 className="text-lg font-semibold">Address Information</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="address.street">Street Address</Label>
                                                <Input
                                                    id="address.street"
                                                    value={user.address?.street || ''}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="address.city">City</Label>
                                                <Input
                                                    id="address.city"
                                                    value={user.address?.city || ''}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="address.province">Province</Label>
                                                <Input
                                                    id="address.province"
                                                    value={user.address?.province || ''}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="address.postalCode">Postal Code</Label>
                                                <Input
                                                    id="address.postalCode"
                                                    value={user.address?.postalCode || ''}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vendor Profile Section */}
                                    {user.role === 'vendor' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Store className="h-5 w-5" />
                                                <h3 className="text-lg font-semibold">Store Information</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="vendorProfile.storeName">Store Name</Label>
                                                    <Input
                                                        id="vendorProfile.storeName"
                                                        value={user.vendorProfile?.storeName || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="vendorProfile.storeSlug">Store URL</Label>
                                                    <Input
                                                        id="vendorProfile.storeSlug"
                                                        value={user.vendorProfile?.storeSlug || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                    />
                                                </div>
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
                                </CardContent>
                                <CardFooter>
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <Button onClick={handleSave} disabled={loading}>
                                                {loading ? "Saving..." : "Save Changes"}
                                            </Button>
                                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={() => setIsEditing(true)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Key className="h-5 w-5" />
                                        Change Password
                                    </CardTitle>
                                    <CardDescription>Update your password to keep your account secure</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button 
                                        onClick={handlePasswordChange} 
                                        disabled={!newPassword || !confirmPassword || loading}
                                    >
                                        {loading ? "Updating..." : "Update Password"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Customer-specific tabs */}
                        {user.role === 'customer' && (
                            <>
                                <TabsContent value="orders" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <ShoppingCart className="h-5 w-5" />
                                                Order History
                                            </CardTitle>
                                            <CardDescription>View your recent orders and their status</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {orderLoading && (
                                                    <p className="text-gray-600">Loading order history...</p>
                                                )}
                                                {orderError && (
                                                    <p className="text-red-600">{orderError}</p>
                                                )}
                                                {!orderLoading && !orderError && orderHistory.length === 0 && (
                                                    <p className="text-gray-600">No orders found.</p>
                                                )}
                                                {!orderLoading && !orderError && orderHistory.map((order) => {
                                                    // Defensive checks
                                                    const itemsArray = Array.isArray(order.items) ? order.items : [];
                                                    // Items could be array of objects or strings
                                                    const itemNames = itemsArray.length > 0
                                                        ? (typeof itemsArray[0] === "object"
                                                            ? itemsArray.map((item: any) => item.name || item.title || "Unnamed Item")
                                                            : itemsArray)
                                                        : [];
                                                    const total = typeof order.total === "number" ? order.total : 0;
                                                    const status = order.status ? order.status.toLowerCase() : "unknown";
                                                    return (
                                                        <div key={order._id || order.id} className="border rounded-lg p-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h3 className="font-semibold">Order #{order.orderNumber || order.id || "N/A"}</h3>
                                                                    <p className="text-sm text-gray-600">
                                                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-CA') : "Unknown date"}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold">${total.toFixed(2)}</p>
                                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                                        status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                        status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                                        status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                        status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                                                                        status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm">
                                                                    Items: {itemNames.join(', ')}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {itemNames.length} item{itemNames.length !== 1 ? 's' : ''}
                                                                </p>
                                                            </div>
                                                            <div className="mt-2 flex gap-2">
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    onClick={() => navigate(`/order/${order._id || order.id}`)}
                                                                >
                                                                    <Eye className="h-4 w-4 mr-1" />
                                                                    View Details
                                                                </Button>
                                                                {status === 'delivered' && (
                                                                    <Button variant="outline" size="sm">
                                                                        Reorder
                                                                    </Button>
                                                                )}
                                                                {order.trackingNumber && (
                                                                    <Button variant="outline" size="sm">
                                                                        Track Order
                                                                    </Button>
                                                                )}
                                                                {canCancelOrder(status) && (
                                                                    <Button 
                                                                        variant="destructive" 
                                                                        size="sm"
                                                                        onClick={() => handleCancelOrder(order._id || order.id, order.orderNumber || order.id)}
                                                                        disabled={cancelLoading === (order._id || order.id)}
                                                                        className="flex items-center gap-1"
                                                                    >
                                                                        {cancelLoading === (order._id || order.id) ? (
                                                                            <>
                                                                                <Clock className="h-3 w-3 animate-spin" />
                                                                                Cancelling...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <XCircle className="h-3 w-3" />
                                                                                Cancel
                                                                            </>
                                                                        )}
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                <TabsContent value="balance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Account Balance
                            </CardTitle>
                            <CardDescription>Track money owed to vendors from account balance orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {balanceLoading && (
                                    <p className="text-gray-600">Loading account balance...</p>
                                )}
                                {balanceError && (
                                    <p className="text-red-600">{balanceError}</p>
                                )}
                                {!balanceLoading && !balanceError && accountBalance && (
                                    <>
                                        {/* Total Balance Summary */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CreditCard className="h-6 w-6 text-blue-600" />
                                                <h3 className="text-lg font-semibold text-blue-900">Total Amount Owed</h3>
                                            </div>
                                            <p className="text-3xl font-bold text-blue-700">
                                                ${accountBalance.totalOwed?.toFixed(2) || '0.00'}
                                            </p>
                                            <p className="text-sm text-blue-600 mt-1">
                                                From {accountBalance.vendorBalances?.length || 0} vendor{accountBalance.vendorBalances?.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>

                                        {/* No balance message */}
                                        {(!accountBalance.vendorBalances || accountBalance.vendorBalances.length === 0) && (
                                            <div className="text-center py-8">
                                                <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Outstanding Balance</h3>
                                                <p className="text-gray-500">You don't owe any money to vendors at this time.</p>
                                            </div>
                                        )}

                                        {/* Vendor Balances */}
                                        {accountBalance.vendorBalances && accountBalance.vendorBalances.length > 0 && (
                                            <div className="space-y-4">
                                                <h4 className="text-md font-semibold text-gray-900">Money Owed by Vendor</h4>
                                                {accountBalance.vendorBalances.map((vendorBalance: any, index: number) => (
                                                    <div key={vendorBalance.vendorId || index} className="border rounded-lg p-4">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h5 className="font-semibold text-lg">{vendorBalance.vendorName}</h5>
                                                                <p className="text-sm text-gray-600">
                                                                    {vendorBalance.orderCount} order{vendorBalance.orderCount !== 1 ? 's' : ''}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xl font-bold text-red-600">
                                                                    ${vendorBalance.amount?.toFixed(2) || '0.00'}
                                                                </p>
                                                                <p className="text-sm text-gray-500">Amount Owed</p>
                                                            </div>
                                                        </div>

                                                        {/* Order Details */}
                                                        {vendorBalance.orders && vendorBalance.orders.length > 0 && (
                                                            <div className="space-y-2">
                                                                <h6 className="text-sm font-medium text-gray-700">Order Details:</h6>
                                                                {vendorBalance.orders.map((order: any, orderIndex: number) => (
                                                                    <div key={order.orderId || orderIndex} 
                                                                         className="bg-gray-50 rounded p-3 flex justify-between items-center">
                                                                        <div>
                                                                            <p className="font-medium text-sm">#{order.orderNumber}</p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {order.date ? new Date(order.date).toLocaleDateString('en-CA') : 'Unknown date'} • {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                                                                            </p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="font-semibold text-sm">${order.amount?.toFixed(2) || '0.00'}</p>
                                                                            <span className={`px-2 py-1 rounded text-xs ${
                                                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                                order.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                                                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                                'bg-gray-100 text-gray-800'
                                                                            }`}>
                                                                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Payment Notice */}
                                        {accountBalance.totalOwed > 0 && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <Package className="h-5 w-5 text-amber-600 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium text-amber-900">Payment Notice</h4>
                                                        <p className="text-sm text-amber-700 mt-1">
                                                            These amounts represent orders you placed using the "Account Balance" payment method. 
                                                            The funds have been credited to your account balance and will need to be paid at a future date.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                            </>
                        )}

                        {/* Vendor-specific tabs */}
                        {user.role === 'vendor' && (
                            <>
                                <TabsContent value="store" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Store className="h-5 w-5" />
                                                Store Management
                                            </CardTitle>
                                            <CardDescription>Manage your store settings and information</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="store-description">Store Description</Label>
                                                    <textarea
                                                        id="store-description"
                                                        className="w-full p-2 border rounded-md"
                                                        rows={3}
                                                        placeholder="Describe your store..."
                                                        defaultValue="Welcome to our amazing store! We offer the best products with excellent customer service."
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="store-policies">Store Policies</Label>
                                                    <textarea
                                                        id="store-policies"
                                                        className="w-full p-2 border rounded-md"
                                                        rows={3}
                                                        placeholder="Store policies..."
                                                        defaultValue="30-day return policy. Free shipping on orders over $50."
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="products" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <Package className="h-5 w-5" />
                                                        Product Management
                                                    </CardTitle>
                                                    <CardDescription>Manage your product inventory</CardDescription>
                                                </div>
                                                <Button>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Product
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {mockVendorProducts.map((product) => (
                                                    <div key={product.id} className="border rounded-lg p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-semibold">{product.name}</h3>
                                                                <p className="text-sm text-gray-600">Price: ${product.price}</p>
                                                                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                                                                <p className="text-sm text-gray-600">Sales: {product.sales}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`px-2 py-1 rounded text-xs ${
                                                                    product.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {product.status}
                                                                </span>
                                                                <div className="mt-2 flex gap-2">
                                                                    <Button variant="outline" size="sm">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="outline" size="sm">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="analytics" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5" />
                                                Sales Analytics
                                            </CardTitle>
                                            <CardDescription>Track your store's performance</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                                <div className="p-4 border rounded-lg">
                                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                                    <p className="text-2xl font-bold text-green-600">${mockSalesData.totalRevenue}</p>
                                                </div>
                                                <div className="p-4 border rounded-lg">
                                                    <p className="text-sm text-gray-600">Total Orders</p>
                                                    <p className="text-2xl font-bold">{mockSalesData.totalOrders}</p>
                                                </div>
                                                <div className="p-4 border rounded-lg">
                                                    <p className="text-sm text-gray-600">Avg Order Value</p>
                                                    <p className="text-2xl font-bold">${mockSalesData.avgOrderValue}</p>
                                                </div>
                                                <div className="p-4 border rounded-lg">
                                                    <p className="text-sm text-gray-600">Conversion Rate</p>
                                                    <p className="text-2xl font-bold">{mockSalesData.conversionRate}%</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-4">Top Selling Products</h3>
                                                <div className="space-y-3">
                                                    {mockSalesData.topProducts.map((product, index) => (
                                                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                                                            <div>
                                                                <p className="font-medium">{product.name}</p>
                                                                <p className="text-sm text-gray-600">{product.sales} sales</p>
                                                            </div>
                                                            <p className="font-bold text-green-600">${product.revenue}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </>
                        )}

                        {/* Admin-specific tabs */}
                        {user.role === 'admin' && (
                            <>
                                <TabsContent value="users" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Users className="h-5 w-5" />
                                                User Management
                                            </CardTitle>
                                            <CardDescription>Manage system users and their permissions</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {mockUserManagement.map((user) => (
                                                    <div key={user.id} className="border rounded-lg p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-semibold">{user.name}</h3>
                                                                <p className="text-sm text-gray-600">{user.email}</p>
                                                                <p className="text-sm text-gray-600">Role: {user.role}</p>
                                                                <p className="text-sm text-gray-600">Joined: {user.joinDate}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`px-2 py-1 rounded text-xs ${
                                                                    user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {user.status}
                                                                </span>
                                                                <div className="mt-2 flex gap-2">
                                                                    <Button variant="outline" size="sm">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="outline" size="sm">
                                                                        <Shield className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="system" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <BarChart3 className="h-5 w-5" />
                                                System Overview
                                            </CardTitle>
                                            <CardDescription>Monitor system performance and statistics</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div className="p-4 border rounded-lg">
                                                    <p className="text-sm text-gray-600">Total Users</p>
                                                    <p className="text-2xl font-bold">1,234</p>
                                                </div>
                                                <div className="p-4 border rounded-lg">
                                                    <p className="text-sm text-gray-600">Active Vendors</p>
                                                    <p className="text-2xl font-bold">156</p>
                                                </div>
                                                <div className="p-4 border rounded-lg">
                                                    <p className="text-sm text-gray-600">Total Products</p>
                                                    <p className="text-2xl font-bold">8,907</p>
                                                </div>
                                                <div className="p-4 border rounded-lg">
                                                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                                                    <p className="text-2xl font-bold">$45,678</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </>
                        )}
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
} 