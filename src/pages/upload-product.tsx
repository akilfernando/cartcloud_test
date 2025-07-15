import Footer from "../components/footer";
import Header from "../components/header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function UploadProductPage() {

    return (
        <div className="flex flex-col min-h-screen" style={{ minHeight: "100vh" }}>
            <Header page="upload-product" role="vendor" />
            <main className="flex-grow pt-28 pb-12 px-4 max-w-xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-8">Upload Product</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Upload New Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div>
                                <Label htmlFor="product-name">Product Name</Label>
                                <Input id="product-name" name="product-name" type="text" placeholder="Enter product name" />
                            </div>
                            <div>
                                <Label htmlFor="product-description">Description</Label>
                                <Textarea id="product-description" name="product-description" placeholder="Enter product description" />
                            </div>
                            <div>
                                <Label htmlFor="product-price">Price</Label>
                                <Input id="product-price" name="product-price" type="number" placeholder="Enter product price"  />
                            </div>
                            <div>
                                <Label htmlFor="product-stock">Stock</Label>
                                <Input id="product-stock" name="product-stock" type="number" placeholder="Enter Stock"/>
                            </div>
                            <div>
                                <Label htmlFor="product-image">Image URL</Label>
                                <Input id="product-image" name="product-image" type="url" placeholder="Enter image URL"  />
                            </div>
                            <div>
                                <Label htmlFor="product-category">Product category</Label>
                                <Input id="product-category" name="product-category" type="text" placeholder="Enter product category" />
                            </div>
                            <Button type="submit" className="w-full">Upload Product</Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}