"use client";
import React, { useState, useEffect } from "react";
import ImageViewer from "@/component/admin/imageSlider/ImageViewer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";

interface Product {
  productId: string;
  productName: string;
  productPrice: number;
  img: string[];
  categories: string[];
  inStock: number;
  soldStockValue: number;
  visibility: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://backend3dx.onrender.com/product/get-products"
      );
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleViewImages = (images: string[], productId: string) => {
    setSelectedImages(images);
    setSelectedProductId(productId);
    setIsImageViewerOpen(true);
  };

  const handleAddImage = (newImage: string) => {
    if (!selectedProductId) return;

    setProducts((prev) =>
      prev.map((product) =>
        product.productId === selectedProductId
          ? { ...product, img: [...product.img, newImage] }
          : product
      )
    );
    setSelectedImages((prev) => [...prev, newImage]);
  };

  const handleDeleteImage = (imageToDelete: string) => {
    if (!selectedProductId) return;

    setProducts((prev) =>
      prev.map((product) =>
        product.productId === selectedProductId
          ? {
              ...product,
              img: product.img.filter((img) => img !== imageToDelete),
            }
          : product
      )
    );
    setSelectedImages((prev) => prev.filter((img) => img !== imageToDelete));
  };

  const handleEdit = (product: Product) => {
    setIsEditing(product.productId);
    setEditedProduct({ ...product });
  };

  const handleSave = () => {
    if (editedProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.productId === editedProduct.productId ? editedProduct : product
        )
      );
    }
    setIsEditing(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Product) => {
    if (editedProduct) {
      setEditedProduct({
        ...editedProduct,
        [field]: e.target.value,
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-pink-50">
      <div className="hidden w-64 border-r bg-white md:block">
        <Sidebar />
      </div>
      <div className="flex-1 p-8 ml-2">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by product ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>In Stock</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>{product.productId}</TableCell>
                <TableCell>
                  {isEditing === product.productId ? (
                    <Input
                      value={editedProduct?.productName || ""}
                      onChange={(e) => handleChange(e, "productName")}
                    />
                  ) : (
                    product.productName
                  )}
                </TableCell>
                <TableCell>
                  {isEditing === product.productId ? (
                    <Input
                      value={editedProduct?.categories.join(", ") || ""}
                      onChange={(e) => handleChange(e, "categories")}
                    />
                  ) : (
                    product.categories.join(", ")
                  )}
                </TableCell>
                <TableCell>
                  {isEditing === product.productId ? (
                    <Input
                      type="number"
                      value={editedProduct?.productPrice || ""}
                      onChange={(e) => handleChange(e, "productPrice")}
                    />
                  ) : (
                    product.productPrice
                  )}
                </TableCell>
                <TableCell>
                  {isEditing === product.productId ? (
                    <Input
                      type="number"
                      value={editedProduct?.inStock || ""}
                      onChange={(e) => handleChange(e, "inStock")}
                    />
                  ) : (
                    product.inStock
                  )}
                </TableCell>
                <TableCell>{product.soldStockValue}</TableCell>
                <TableCell>
                  {isEditing === product.productId ? (
                    <Input
                      value={editedProduct?.visibility || ""}
                      onChange={(e) => handleChange(e, "visibility")}
                    />
                  ) : (
                    product.visibility
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleViewImages(product.img, product.productId)}
                  >
                    View Images
                  </Button>
                </TableCell>
                <TableCell>
                  {isEditing === product.productId ? (
                    <Button onClick={handleSave}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEdit(product)}>Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {isImageViewerOpen && (
          <ImageViewer
            images={selectedImages}
            onClose={() => setIsImageViewerOpen(false)}
            onAddImage={handleAddImage}
            onDeleteImage={handleDeleteImage}
          />
        )}
      </div>
    </div>
  );
}
