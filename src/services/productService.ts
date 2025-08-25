import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  Product,
  ProductStaging,
  CreateProductData,
  UpdateProductData,
} from "@/types";

// Staging endpoints
export const productStagingService = {
  async getAll(): Promise<ProductStaging[]> {
    const response = await fetchWithAuth("/api/admin/products/staging");
    if (!response.ok) {
      throw new Error("Failed to fetch staging products");
    }
    return response.json();
  },

  async create(data: CreateProductData): Promise<ProductStaging> {
    const response = await fetchWithAuth("/api/admin/products/staging", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create product");
    }
    return response.json();
  },

  async update(id: string, data: UpdateProductData): Promise<ProductStaging> {
    const response = await fetchWithAuth(`/api/admin/products/staging/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetchWithAuth(`/api/admin/products/staging/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
  },

  async uploadToProduction(): Promise<{ success: boolean; publishedCount: number }> {
    const response = await fetchWithAuth("/api/admin/products/publish", {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to upload products to production");
    }
    return response.json();
  },
};

// Production endpoints
export const productProductionService = {
  async getAll(): Promise<Product[]> {
    const response = await fetchWithAuth("/api/admin/products/production");
    if (!response.ok) {
      throw new Error("Failed to fetch production products");
    }
    return response.json();
  },
};
