import { fetchWithAuth } from '@/lib/fetchWithAuth';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryStaging {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
}

// UpdateCategoryData is the same as CreateCategoryData for now
export type UpdateCategoryData = CreateCategoryData;

// Production Categories API
export const categoryService = {
  // Get all production categories
  async getCategories(): Promise<Category[]> {
    const response = await fetchWithAuth('/api/admin/products/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.data;
  },

  // Create a new production category
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    const response = await fetchWithAuth('/api/admin/products/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create category');
    }
    const data = await response.json();
    return data.data;
  },
};

// Staging Categories API
export const categoryStagingService = {
  // Get all staging categories
  async getStagingCategories(): Promise<CategoryStaging[]> {
    const response = await fetchWithAuth('/api/admin/products/categories/staging');
    if (!response.ok) {
      throw new Error('Failed to fetch staging categories');
    }
    const data = await response.json();
    return data.data;
  },

  // Create a new staging category
  async createStagingCategory(categoryData: CreateCategoryData): Promise<CategoryStaging> {
    const response = await fetchWithAuth('/api/admin/products/categories/staging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create staging category');
    }
    const data = await response.json();
    return data.data;
  },

  // Update staging categories (bulk replace)
  async updateStagingCategories(
    activeCategories: CreateCategoryData[],
    deletedCategories: CreateCategoryData[] = []
  ): Promise<{
    activeCategories: CategoryStaging[];
    deletedCategories: CategoryStaging[];
  }> {
    const response = await fetchWithAuth('/api/admin/products/categories/staging', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categories: activeCategories,
        deletedCategories,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update staging categories');
    }
    const data = await response.json();
    return data.data;
  },

  // Save categories to staging (bulk save)
  async saveToStaging(categories: CreateCategoryData[]): Promise<CategoryStaging[]> {
    const response = await fetchWithAuth('/api/admin/products/categories/staging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save categories to staging');
    }
    const data = await response.json();
    return data.data;
  },
};

// Production Upload API
export const categoryProductionService = {
  // Upload staging categories to production
  async uploadToProduction(): Promise<Category[]> {
    const response = await fetchWithAuth('/api/admin/products/categories/production', {
      method: 'POST',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload categories to production');
    }
    const data = await response.json();
    return data.data;
  },

  // Publish staging categories to production
  async publishToProduction(): Promise<Category[]> {
    const response = await fetchWithAuth('/api/admin/products/categories/publish', {
      method: 'POST',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to publish categories to production');
    }
    const data = await response.json();
    return data.data;
  },
};
