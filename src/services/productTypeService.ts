import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  ProductType,
  ProductTypeStaging,
  CreateProductTypeData,
  UpdateProductTypeData,
} from "@/types";

// Staging endpoints
export const productTypeStagingService = {
  async getAll(): Promise<ProductTypeStaging[]> {
    const response = await fetchWithAuth("/api/admin/products/product-types/staging");
    if (!response.ok) {
      throw new Error("Failed to fetch staging product types");
    }
    return response.json();
  },

  async create(data: CreateProductTypeData): Promise<ProductTypeStaging> {
    const response = await fetchWithAuth("/api/admin/products/product-types/staging", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create product type");
    }
    return response.json();
  },

  async update(id: string, data: UpdateProductTypeData): Promise<ProductTypeStaging> {
    const response = await fetchWithAuth(`/api/admin/products/product-types/staging/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update product type");
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetchWithAuth(`/api/admin/products/product-types/staging/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete product type");
    }
  },

  async uploadToProduction(): Promise<{ success: boolean; publishedCount: number }> {
    const response = await fetchWithAuth("/api/admin/products/product-types/publish", {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to upload product types to production");
    }
    return response.json();
  },
};

// Production endpoints
export const productTypeProductionService = {
  async getAll(): Promise<ProductType[]> {
    const response = await fetchWithAuth("/api/admin/products/product-types/production");
    if (!response.ok) {
      throw new Error("Failed to fetch production product types");
    }
    return response.json();
  },
};
