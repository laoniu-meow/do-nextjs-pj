import { useState, useCallback, useEffect } from 'react';
import { 
  productCategoryStagingService, 
  productCategoryProductionService,
  productCategoryService,
  type ProductCategory,
  type ProductCategoryStaging,
  type CreateProductCategoryData
} from '@/services/productCategoryService';

interface UseProductCategoryStagingReturn {
  // Data
  stagingProductCategories: ProductCategoryStaging[];
  productionProductCategories: ProductCategory[];
  
  // State
  loading: boolean;
  error: string | null;
  success: string | null;
  isDirty: boolean;
  hasStaging: boolean;
  
  // Actions
  addProductCategory: (productCategory: CreateProductCategoryData, isDeleted?: boolean) => void;
  editProductCategory: (id: string, productCategory: CreateProductCategoryData) => void;
  deleteProductCategory: (id: string) => void;
  saveToStaging: () => Promise<void>;
  uploadToProduction: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearMessages: () => void;
}

export function useProductCategoryStaging(): UseProductCategoryStagingReturn {
  // State
  const [stagingProductCategories, setStagingProductCategories] = useState<ProductCategoryStaging[]>([]);
  const [productionProductCategories, setProductionProductCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Check if we have staging data
  const hasStaging = stagingProductCategories.length > 0;

  // Load production product categories
  const loadProductionProductCategories = useCallback(async () => {
    try {
      const categories = await productCategoryService.getProductionProductCategories();
      setProductionProductCategories(categories);
    } catch (err) {
      console.error('Failed to load production product categories:', err);
    }
  }, []);

  // Load staging product categories
  const loadStagingProductCategories = useCallback(async () => {
    try {
      const categories = await productCategoryStagingService.getStagingProductCategories();
      setStagingProductCategories(categories);
    } catch (err) {
      console.error('Failed to load staging product categories:', err);
    }
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadProductionProductCategories(),
        loadStagingProductCategories()
      ]);
      setIsDirty(false);
    } catch (err) {
      setError('Failed to refresh data');
      console.error('Failed to refresh data:', err);
    } finally {
      setLoading(false);
    }
  }, [loadProductionProductCategories, loadStagingProductCategories]);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Add new product category to staging
  const addProductCategory = useCallback((productCategoryData: CreateProductCategoryData, isDeleted: boolean = false) => {
    const newProductCategory: ProductCategoryStaging = {
      id: `temp-${Date.now()}-${Math.random()}`,
      ...productCategoryData,
      isDeleted,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setStagingProductCategories(prev => [...prev, newProductCategory]);
    setIsDirty(true);
  }, []);

  // Edit existing product category in staging
  const editProductCategory = useCallback((id: string, productCategoryData: CreateProductCategoryData) => {
    setStagingProductCategories(prev => 
      prev.map(cat => 
        cat.id === id 
          ? { ...cat, ...productCategoryData, updatedAt: new Date() }
          : cat
      )
    );
    setIsDirty(true);
  }, []);

  // Delete product category (mark for deletion)
  const deleteProductCategory = useCallback((id: string) => {
    setStagingProductCategories(prev => 
      prev.map(cat => 
        cat.id === id 
          ? { ...cat, isDeleted: true, updatedAt: new Date() }
          : cat
      )
    );
    setIsDirty(true);
  }, []);

  // Save to staging
  const saveToStaging = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Separate active and deleted product categories
      const activeProductCategories = stagingProductCategories
        .filter(cat => !cat.isDeleted)
        .map(cat => ({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          categoryId: cat.categoryId,
          isActive: cat.isActive,
          sortOrder: cat.sortOrder,
        }));

      const deletedProductCategories = stagingProductCategories
        .filter(cat => cat.isDeleted)
        .map(cat => ({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          categoryId: cat.categoryId,
          isActive: cat.isActive,
          sortOrder: cat.sortOrder,
        }));

      // Update staging
      await productCategoryStagingService.updateStagingProductCategories(activeProductCategories, deletedProductCategories);
      
      // Refresh staging data
      await loadStagingProductCategories();
      
      setSuccess('Product categories saved to staging successfully');
      setIsDirty(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save to staging';
      setError(errorMessage);
      console.error('Failed to save to staging:', err);
    } finally {
      setLoading(false);
    }
  }, [stagingProductCategories, loadStagingProductCategories]);

  // Upload to production
  const uploadToProduction = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await productCategoryProductionService.uploadToProduction();
      
      // Refresh all data
      await refreshData();
      
      setSuccess('Product categories uploaded to production successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload to production';
      setError(errorMessage);
      console.error('Failed to upload to production:', err);
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    // Data
    stagingProductCategories,
    productionProductCategories,
    
    // State
    loading,
    error,
    success,
    isDirty,
    hasStaging,
    
    // Actions
    addProductCategory,
    editProductCategory,
    deleteProductCategory,
    saveToStaging,
    uploadToProduction,
    refreshData,
    clearMessages,
  };
}
