import { fetchWithAuth } from '@/lib/fetchWithAuth';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategoryStaging {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string | null;
  isActive: boolean;
  sortOrder: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductCategoryData {
  name: string;
  slug: string;
  description?: string;
  categoryId?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export type UpdateProductCategoryData = CreateProductCategoryData;

// Production Product Categories API
export const productCategoryService = {
  // Get all production product categories
  async getProductionProductCategories(): Promise<ProductCategory[]> {
    const response = await fetchWithAuth('/api/admin/products/product-categories');
    if (!response.ok) {
      throw new Error('Failed to fetch product categories');
    }
    const data = await response.json();
    return data.data;
  },

  // Create a new production product category
  async createProductCategory(productCategoryData: CreateProductCategoryData): Promise<ProductCategory> {
    const response = await fetchWithAuth('/api/admin/products/product-categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productCategoryData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create product category');
    }
    const data = await response.json();
    return data.data;
  },
};

// Staging Product Categories API
export const productCategoryStagingService = {
  // Get all staging product categories
  async getStagingProductCategories(): Promise<ProductCategoryStaging[]> {
    const response = await fetchWithAuth('/api/admin/products/product-categories/staging');
    if (!response.ok) {
      throw new Error('Failed to fetch staging product categories');
    }
    const data = await response.json();
    return data.data;
  },

  // Create a new staging product category
  async createStagingProductCategory(productCategoryData: CreateProductCategoryData): Promise<ProductCategoryStaging> {
    const response = await fetchWithAuth('/api/admin/products/product-categories/staging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productCategoryData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create staging product category');
    }
    const data = await response.json();
    return data.data;
  },

  // Update staging product categories (bulk replace)
  async updateStagingProductCategories(
    activeProductCategories: CreateProductCategoryData[],
    deletedProductCategories: CreateProductCategoryData[] = []
  ): Promise<{
    activeProductCategories: ProductCategoryStaging[];
    deletedProductCategories: ProductCategoryStaging[];
  }> {
    const response = await fetchWithAuth('/api/admin/products/product-categories/staging', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productCategories: activeProductCategories,
        deletedProductCategories,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update staging product categories');
    }
    const data = await response.json();
    return data.data;
  },

  // Save product categories to staging (bulk save)
  async saveToStaging(productCategories: CreateProductCategoryData[]): Promise<ProductCategoryStaging[]> {
    const response = await fetchWithAuth('/api/admin/products/product-categories/staging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productCategories }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save product categories to staging');
    }
    const data = await response.json();
    return data.data;
  },
};

// Production Upload API
export const productCategoryProductionService = {
  // Upload staging product categories to production
  async uploadToProduction(): Promise<ProductCategory[]> {
    const response = await fetchWithAuth('/api/admin/products/product-categories/production', {
      method: 'POST',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload product categories to production');
    }
    const data = await response.json();
    return data.data;
  },

  // Publish staging product categories to production
  async publishToProduction(): Promise<ProductCategory[]> {
    const response = await fetchWithAuth('/api/admin/products/product-categories/publish', {
      method: 'POST',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to publish product categories to production');
    }
    const data = await response.json();
    return data.data;
  },
};
