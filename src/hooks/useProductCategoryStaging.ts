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
    // Check if this is a production item that needs to be converted to staging
    const productionItem = productionProductCategories.find(p => p.id === id);
    const stagingItem = stagingProductCategories.find(s => s.id === id);
    
    if (productionItem && !stagingItem) {
      // Check if there are actual changes before creating staging entry
      const hasChanges = 
        productCategoryData.name !== productionItem.name ||
        productCategoryData.description !== productionItem.description ||
        productCategoryData.categoryId !== productionItem.categoryId ||
        productCategoryData.isActive !== productionItem.isActive ||
        productCategoryData.sortOrder !== productionItem.sortOrder;

      if (hasChanges) {
        // Create a new staging entry from the production item
        const newStagingItem: ProductCategoryStaging = {
          ...productionItem,
          isDeleted: false,
          updatedAt: new Date(),
          ...productCategoryData,
          slug: productCategoryData.slug || productionItem.slug,
        };
        
        setStagingProductCategories(prev => [...prev, newStagingItem]);
        setSuccess('Product category updated successfully');
      } else {
        // No changes, just show a message
        setSuccess('No changes detected');
      }
    } else if (stagingItem) {
      // Check if there are actual changes before updating
      const hasChanges = 
        productCategoryData.name !== stagingItem.name ||
        productCategoryData.description !== stagingItem.description ||
        productCategoryData.categoryId !== stagingItem.categoryId ||
        productCategoryData.isActive !== stagingItem.isActive ||
        productCategoryData.sortOrder !== stagingItem.sortOrder;

      if (hasChanges) {
        // Update existing staging item
        setStagingProductCategories(prev => prev.map(item => 
          item.id === id 
            ? { 
                ...item, 
                ...productCategoryData, 
                slug: productCategoryData.slug || item.slug,
                updatedAt: new Date() 
              }
            : item
        ));
        setSuccess('Product category updated successfully');
      } else {
        // No changes, just show a message
        setSuccess('No changes detected');
      }
    }
    
    setTimeout(() => setSuccess(null), 3000);
  }, [stagingProductCategories, productionProductCategories]);

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
