import React, { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  vendorProfile?: { storeName?: string };
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  vendorId: string;
  vendorName?: string;
  category: string;
  description?: string;
  isActive: boolean;
}

interface Vendor {
  _id: string;
  name: string;
  role: string;
  vendorProfile?: { storeName?: string };
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  status: string;
  paymentStatus?: string;
  total: number;
  createdAt: string;
  items: any[];
}

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState("customers");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "customer", password: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [productSearch, setProductSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderUsers, setOrderUsers] = useState<User[]>([]);
  const [selectedOrderUser, setSelectedOrderUser] = useState<string>("");
  const [orderSearch, setOrderSearch] = useState("");
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  
  // Product management state
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [showEditProductDialog, setShowEditProductDialog] = useState(false);
  const [showDeleteProductDialog, setShowDeleteProductDialog] = useState(false);
  const [showCreateProductDialog, setShowCreateProductDialog] = useState(false);
  const [productForm, setProductForm] = useState({ 
    name: "", 
    price: "", 
    stock: "", 
    category: "", 
    description: "",
    isActive: true 
  });
  const [productFormLoading, setProductFormLoading] = useState(false);
  
  // Order management state
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);
  const [showEditOrderDialog, setShowEditOrderDialog] = useState(false);
  const [showDeleteOrderDialog, setShowDeleteOrderDialog] = useState(false);
  const [orderForm, setOrderForm] = useState({ 
    status: "", 
    paymentStatus: "",
    total: ""
  });
  const [orderFormLoading, setOrderFormLoading] = useState(false);
  
  const navigate = useNavigate();

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log('Users fetched:', res.data);
      setUsers(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      addToast({
        title: "Error fetching customers",
        description: "There was a problem fetching customers.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Only vendors
      setVendors(res.data.filter((u: Vendor) => u.role === "vendor"));
    } catch (err: any) {
      addToast({
        title: "Error fetching vendors",
        description: "There was a problem fetching vendors.",
        variant: "error",
      });
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(res.data);
    } catch (err: any) {
      addToast({
        title: "Error fetching products",
        description:  "There was a problem fetching products.",
        variant: "error",
      });
    }
  };

  // Fetch users for order filtering
  const fetchOrderUsers = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrderUsers(res.data);
    } catch (err: any) {
      addToast({
        title: "Error fetching users",
        description: "There was a problem fetching users.",
        variant: "error",
      });
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(res.data);
    } catch (err: any) {
      addToast({
        title: "Error fetching orders",
        description: "There was a problem fetching orders.",
        variant: "error",
      });
    }
  };

  // Open user drawer and fetch details
  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setShowUserDialog(true);
    setUserDetails(null);
    setUserOrders([]);
    setUserProducts([]);
    setUserLoading(true);
    try {
      // Fetch user details
      const userRes = await axios.get(import.meta.env.VITE_API_URL + `/users/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserDetails(userRes.data);
      if (user.role === "vendor") {
        // Fetch vendor's products
        const prodRes = await axios.get(import.meta.env.VITE_API_URL + `/products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserProducts(prodRes.data.filter((p: Product) => p.vendorId === user._id));
      } else if (user.role === "customer") {
        // Fetch user's orders
        const orderRes = await axios.get(import.meta.env.VITE_API_URL + `/orders/user/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserOrders(orderRes.data);
      }
    } catch (err: any) {
      addToast({
        title: "Error fetching user details",
        description: err.response?.data?.message || err.message || "There was a problem fetching user data.",
        variant: "error",
      });
    } finally {
      setUserLoading(false);
    }
  };

  const handleViewUserProfile = (user: User) => {
    navigate(`/profile/${user._id}`);
  };

  useEffect(() => {
    if (tab === "customers") {
      fetchCustomers();
    }
    if (tab === "vendors") {
      fetchVendors();
    }
    if (tab === "product-search") {
      fetchVendors();
      fetchProducts();
    }
    if (tab === "order-search") {
      fetchOrderUsers();
      fetchOrders();
    }
  }, [tab]);

  // Filtered users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Filter products by category, status, and search
  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase()) &&
      (selectedStatus === "all" || 
        (selectedStatus === "active" && p.isActive) || 
        (selectedStatus === "inactive" && !p.isActive)
      ) &&
      p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Get unique categories from products
  const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);

  // Filter orders by user and search
  const filteredOrders = orders.filter(
    (o) =>
      (selectedOrderUser === "all" || !selectedOrderUser || o.userId === selectedOrderUser) &&
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase())
  );

  
  const handleEdit = (user: User) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, password: "" });
    setShowEditDialog(true);
  };
  const handleDelete = (user: User) => {
    setDeleteUser(user);
    setShowDeleteDialog(true);
  };
  const handleCreate = () => {
    setForm({ name: "", email: "", role: "customer", password: "" });
    setShowCreateDialog(true);
  };

  const submitEdit = async () => {
    if (!editUser) return;
    setFormLoading(true);
    try {
      await axios.put(`/api/users/${editUser._id}`, {
        name: form.name,
        email: form.email,
        role: form.role,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      addToast({ title: "User updated", variant: "success" });
      setShowEditDialog(false);
      fetchCustomers();
    } catch (err: any) {
      addToast({ title: "Error updating user", description: err.response?.data?.message || err.message, variant: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  const submitDelete = async () => {
    if (!deleteUser) return;
    setFormLoading(true);
    try {
      await axios.delete(`/api/users/${deleteUser._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      addToast({ title: "User deleted", variant: "success" });
      setShowDeleteDialog(false);
      fetchCustomers();
    } catch (err: any) {
      addToast({ title: "Error deleting user", description: err.response?.data?.message || err.message, variant: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  const submitCreate = async () => {
    setFormLoading(true);
    try {
      await axios.post(`/api/users`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      addToast({ title: "User created", variant: "success" });
      setShowCreateDialog(false);
      fetchCustomers();
    } catch (err: any) {
      addToast({ title: "Error creating user", description: err.response?.data?.message || err.message, variant: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  // Product management handlers
  const handleEditProduct = (product: Product) => {
    if (!product) {
      addToast({
        title: "Error",
        description: "Product data is missing",
        variant: "error",
      });
      return;
    }
    
    setEditProduct(product);
    setProductForm({ 
      name: product?.name || "", 
      price: (product?.price || 0).toString(), 
      stock: (product?.stock || 0).toString(), 
      category: product?.category || "", 
      description: product?.description || "",
      isActive: product?.isActive !== undefined ? product.isActive : true 
    });
    setShowEditProductDialog(true);
  };

  const handleDeleteProduct = (product: Product) => {
    if (!product) {
      addToast({
        title: "Error",
        description: "Product data is missing",
        variant: "error",
      });
      return;
    }
    
    setDeleteProduct(product);
    setShowDeleteProductDialog(true);
  };

  const handleCreateProduct = () => {
    setProductForm({ 
      name: "", 
      price: "", 
      stock: "", 
      category: "", 
      description: "",
      isActive: true 
    });
    setShowCreateProductDialog(true);
  };

  const submitEditProduct = async () => {
    if (!editProduct) return;
    setProductFormLoading(true);
    try {
      await axios.put(import.meta.env.VITE_API_URL + `/products/${editProduct._id}`, {
        name: productForm.name,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        category: productForm.category,
        description: productForm.description,
        isActive: productForm.isActive,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      addToast({ title: "Product updated", variant: "success" });
      setShowEditProductDialog(false);
      fetchProducts();
    } catch (err: any) {
      addToast({ title: "Error updating product", description: err.response?.data?.message || err.message, variant: "error" });
    } finally {
      setProductFormLoading(false);
    }
  };

  const submitDeleteProduct = async () => {
    if (!deleteProduct) return;
    setProductFormLoading(true);
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/products/${deleteProduct._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      addToast({ title: "Product deleted", variant: "success" });
      setShowDeleteProductDialog(false);
      fetchProducts();
    } catch (err: any) {
      addToast({ title: "Error deleting product", description: err.response?.data?.message || err.message, variant: "error" });
    } finally {
      setProductFormLoading(false);
    }
  };

  const submitCreateProduct = async () => {
    setProductFormLoading(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + `/products`, {
        name: productForm.name,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        category: productForm.category,
        description: productForm.description,
        isActive: productForm.isActive,
        vendorId: localStorage.getItem("userId"), // This will be the admin's ID
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      addToast({ title: "Product created", variant: "success" });
      setShowCreateProductDialog(false);
      fetchProducts();
    } catch (err: any) {
      addToast({ title: "Error creating product", description: err.response?.data?.message || err.message, variant: "error" });
    } finally {
      setProductFormLoading(false);
    }
  };

  // Order management handlers
  const handleEditOrder = (order: Order) => {
    if (!order) {
      addToast({
        title: "Error",
        description: "Order data is missing",
        variant: "error",
      });
      return;
    }
    
    setEditOrder(order);
    setOrderForm({ 
      status: order?.status || "", 
      paymentStatus: order?.paymentStatus || "",
      total: order?.total?.toString() || ""
    });
    setShowEditOrderDialog(true);
  };

  const handleDeleteOrder = (order: Order) => {
    if (!order) {
      addToast({
        title: "Error",
        description: "Order data is missing",
        variant: "error",
      });
      return;
    }
    
    setDeleteOrder(order);
    setShowDeleteOrderDialog(true);
  };

  const submitEditOrder = async () => {
    if (!editOrder) return;
    setOrderFormLoading(true);
    try {
      await axios.patch(import.meta.env.VITE_API_URL + `/orders/${editOrder._id}/deliver`, {
        status: orderForm.status,
        paymentStatus: orderForm.paymentStatus,
        total: parseFloat(orderForm.total),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      addToast({ title: "Order updated", variant: "success" });
      setShowEditOrderDialog(false);
      fetchOrders();
    } catch (err: any) {
      addToast({ title: "Error updating order", description: err.response?.data?.message || err.message, variant: "error" });
    } finally {
      setOrderFormLoading(false);
    }
  };

  const submitDeleteOrder = async () => {
    if (!deleteOrder) return;
    setOrderFormLoading(true);
    try {
      await axios.patch(import.meta.env.VITE_API_URL + `/orders/${deleteOrder._id}/cancel`, {
        reason: "Admin cancelled order"
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      addToast({ title: "Order cancelled", variant: "success" });
      setShowDeleteOrderDialog(false);
      fetchOrders();
    } catch (err: any) {
      addToast({ title: "Error cancelling order", description: err.response?.data?.message || err.message, variant: "error" });
    } finally {
      setOrderFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header page="profile" />
      <main className="flex-1 container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="product-search">Product Search</TabsTrigger>
            <TabsTrigger value="order-search">Order Search</TabsTrigger>
          </TabsList>
          <TabsContent value="customers">
            {/* User management for customers only */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Customer Management</CardTitle>
                <div className="flex gap-2 items-center">
                  <Input
                    type="text"
                    placeholder="Search customers..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-48"
                  />
                  <Button onClick={handleCreate}>Create User</Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading && <p>Loading users...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr>
                          <th className="border px-2 py-1">Name</th>
                          <th className="border px-2 py-1">Email</th>
                          <th className="border px-2 py-1">Role</th>
                          <th className="border px-2 py-1">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.filter(u => u.role === "customer").map((user) => (
                          <tr key={user._id}>
                            <td className="border px-2 py-1">{user.name}</td>
                            <td className="border px-2 py-1">{user.email}</td>
                            <td className="border px-2 py-1 capitalize">{user.role}</td>
                            <td className="border px-2 py-1 space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(user)}>Delete</Button>
                              <Button size="sm" variant="default" onClick={() => handleViewUserProfile(user)}>View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredUsers.filter(u => u.role === "customer").length === 0 && (
                      <p className="text-gray-500 mt-4">No customers found.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Edit User Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>Update user details and role.</DialogDescription>
                </DialogHeader>
                <form onSubmit={e => { e.preventDefault(); submitEdit(); }}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={form.role} onValueChange={val => setForm(f => ({ ...f, role: val }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="vendor">Vendor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button type="submit" disabled={formLoading}>Save</Button>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {/* Delete User Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete User</DialogTitle>
                  <DialogDescription>Are you sure you want to delete this user?</DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button variant="destructive" onClick={submitDelete} disabled={formLoading}>Delete</Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* Create User Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create User</DialogTitle>
                  <DialogDescription>Fill in the details to create a new user.</DialogDescription>
                </DialogHeader>
                <form onSubmit={e => { e.preventDefault(); submitCreate(); }}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={form.role} onValueChange={val => setForm(f => ({ ...f, role: val }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="vendor">Vendor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button type="submit" disabled={formLoading}>Create</Button>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>
          <TabsContent value="vendors">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Vendor Management</CardTitle>
                <div className="flex gap-2 items-center">
                  <Input
                    type="text"
                    placeholder="Search vendors..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-48"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loading && <p>Loading users...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr>
                          <th className="border px-2 py-1">Name</th>
                          <th className="border px-2 py-1">Email</th>
                          <th className="border px-2 py-1">Store</th>
                          <th className="border px-2 py-1">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.filter(u => u.role === "vendor").map((user) => (
                          <tr key={user._id}>
                            <td className="border px-2 py-1">{user.name}</td>
                            <td className="border px-2 py-1">{user.email}</td>
                            <td className="border px-2 py-1">{user.vendorProfile?.storeName || "N/A"}</td>
                            <td className="border px-2 py-1 space-x-2">
                              <Button size="sm" variant="default" onClick={() => handleViewUserProfile(user)}>View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredUsers.filter(u => u.role === "vendor").length === 0 && (
                      <p className="text-gray-500 mt-4">No vendors found.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="product-search">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Search</CardTitle>
                <div className="flex gap-2 items-center">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="w-48"
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleCreateProduct}>Create Product</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1">Name</th>
                        <th className="border px-2 py-1">Category</th>
                        <th className="border px-2 py-1">Price</th>
                        <th className="border px-2 py-1">Stock</th>
                        <th className="border px-2 py-1">Vendor</th>
                        <th className="border px-2 py-1">Status</th>
                        <th className="border px-2 py-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const vendor = vendors.find(v => v._id === product.vendorId);
                        return (
                          <tr key={product._id}>
                            <td className="border px-2 py-1">{product.name}</td>
                            <td className="border px-2 py-1">{product.category}</td>
                            <td className="border px-2 py-1">${product.price.toFixed(2)}</td>
                            <td className="border px-2 py-1">{product.stock}</td>
                            <td className="border px-2 py-1">{vendor?.vendorProfile?.storeName || vendor?.name || "Unknown Vendor"}</td>
                            <td className="border px-2 py-1">{product.isActive ? "Active" : "Inactive"}</td>
                            <td className="border px-2 py-1 space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product)}>Delete</Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredProducts.length === 0 && (
                    <p className="text-gray-500 mt-4">No products found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="order-search">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order Search</CardTitle>
                <div className="flex gap-2 items-center">
                  <Input
                    type="text"
                    placeholder="Search orders..."
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    className="w-48"
                  />
                  <Select value={selectedOrderUser} onValueChange={setSelectedOrderUser}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {orderUsers.map((u) => (
                        <SelectItem key={u._id} value={u._id}>{u.name} ({u.email})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1">Order #</th>
                        <th className="border px-2 py-1">User</th>
                        <th className="border px-2 py-1">Total</th>
                        <th className="border px-2 py-1">Status</th>
                        <th className="border px-2 py-1">Created</th>
                        <th className="border px-2 py-1">Items</th>
                        <th className="border px-2 py-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => {
                        const user = orderUsers.find(u => u._id === order.userId);
                        return (
                          <tr key={order._id}>
                            <td className="border px-2 py-1">{order.orderNumber}</td>
                            <td className="border px-2 py-1">{user ? `${user.name} (${user.email})` : order.userId}</td>
                            <td className="border px-2 py-1">${order.total?.toFixed(2)}</td>
                            <td className="border px-2 py-1">{order.status}</td>
                            <td className="border px-2 py-1">{new Date(order.createdAt).toLocaleString()}</td>
                            <td className="border px-2 py-1">{order.items.length}</td>
                            <td className="border px-2 py-1 space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditOrder(order)}>Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteOrder(order)}>Cancel</Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && (
                    <p className="text-gray-500 mt-4">No orders found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Edit Product Dialog */}
        <Dialog open={showEditProductDialog} onOpenChange={setShowEditProductDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update product details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={e => { e.preventDefault(); submitEditProduct(); }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product-name">Name</Label>
                  <Input 
                    id="product-name" 
                    value={productForm.name} 
                    onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="product-price">Price</Label>
                  <Input 
                    id="product-price" 
                    type="number" 
                    step="0.01" 
                    value={productForm.price} 
                    onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="product-stock">Stock</Label>
                  <Input 
                    id="product-stock" 
                    type="number" 
                    value={productForm.stock} 
                    onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="product-category">Category</Label>
                  <Input 
                    id="product-category" 
                    value={productForm.category} 
                    onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="product-description">Description</Label>
                  <Input 
                    id="product-description" 
                    value={productForm.description} 
                    onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="product-active"
                    checked={productForm.isActive}
                    onChange={e => setProductForm(f => ({ ...f, isActive: e.target.checked }))}
                  />
                  <Label htmlFor="product-active">Active</Label>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={productFormLoading}>Save</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Product Dialog */}
        <Dialog open={showDeleteProductDialog} onOpenChange={setShowDeleteProductDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>Are you sure you want to delete this product?</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="destructive" onClick={submitDeleteProduct} disabled={productFormLoading}>Delete</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Product Dialog */}
        <Dialog open={showCreateProductDialog} onOpenChange={setShowCreateProductDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Product</DialogTitle>
              <DialogDescription>Fill in the details to create a new product.</DialogDescription>
            </DialogHeader>
            <form onSubmit={e => { e.preventDefault(); submitCreateProduct(); }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="create-product-name">Name</Label>
                  <Input 
                    id="create-product-name" 
                    value={productForm.name} 
                    onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="create-product-price">Price</Label>
                  <Input 
                    id="create-product-price" 
                    type="number" 
                    step="0.01" 
                    value={productForm.price} 
                    onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="create-product-stock">Stock</Label>
                  <Input 
                    id="create-product-stock" 
                    type="number" 
                    value={productForm.stock} 
                    onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="create-product-category">Category</Label>
                  <Input 
                    id="create-product-category" 
                    value={productForm.category} 
                    onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="create-product-description">Description</Label>
                  <Input 
                    id="create-product-description" 
                    value={productForm.description} 
                    onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="create-product-active"
                    checked={productForm.isActive}
                    onChange={e => setProductForm(f => ({ ...f, isActive: e.target.checked }))}
                  />
                  <Label htmlFor="create-product-active">Active</Label>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={productFormLoading}>Create</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Order Dialog */}
        <Dialog open={showEditOrderDialog} onOpenChange={setShowEditOrderDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Order</DialogTitle>
              <DialogDescription>Update order status and details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={e => { e.preventDefault(); submitEditOrder(); }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="order-status">Status</Label>
                  <Select value={orderForm.status} onValueChange={val => setOrderForm(f => ({ ...f, status: val }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order-payment-status">Payment Status</Label>
                  <Select value={orderForm.paymentStatus} onValueChange={val => setOrderForm(f => ({ ...f, paymentStatus: val }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order-total">Total</Label>
                  <Input 
                    id="order-total" 
                    type="number" 
                    step="0.01" 
                    value={orderForm.total} 
                    onChange={e => setOrderForm(f => ({ ...f, total: e.target.value }))} 
                    required 
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={orderFormLoading}>Save</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Order Dialog */}
        <Dialog open={showDeleteOrderDialog} onOpenChange={setShowDeleteOrderDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>Are you sure you want to cancel this order? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="destructive" onClick={submitDeleteOrder} disabled={orderFormLoading}>Cancel Order</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Keep Order</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
      {/* User Detail Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogClose asChild>
              <Button variant="outline" className="absolute top-4 right-4">Close</Button>
            </DialogClose>
          </DialogHeader>
          {userLoading ? (
            <div className="p-6">Loading...</div>
          ) : selectedUser && userDetails ? (
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-2">Profile</h2>
                <div>Name: {userDetails.name}</div>
                <div>Email: {userDetails.email}</div>
                <div>Role: {userDetails.role}</div>
                {userDetails.vendorProfile && (
                  <div>Store: {userDetails.vendorProfile.storeName}</div>
                )}
              </div>
              {selectedUser.role === "vendor" && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Products</h2>
                  <ul className="list-disc pl-5">
                    {userProducts.map((p) => (
                      <li key={p._id}>{p.name} (${p.price})</li>
                    ))}
                  </ul>
                  <div className="mt-2 text-sm text-gray-500">Total products: {userProducts.length}</div>
                  {/* Analytics placeholder */}
                  <div className="mt-4">Analytics: (Coming soon)</div>
                </div>
              )}
              {selectedUser.role === "customer" && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Orders</h2>
                  <ul className="list-disc pl-5">
                    {userOrders.map((o) => (
                      <li key={o._id}>Order #{o.orderNumber} - ${o.total?.toFixed(2)} - {o.status}</li>
                    ))}
                  </ul>
                  <div className="mt-2 text-sm text-gray-500">Total orders: {userOrders.length}</div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard; 