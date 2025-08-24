import { useState, useCallback, useEffect } from 'react';
import { 
  categoryStagingService, 
  categoryProductionService,
  categoryService,
  type Category,
  type CategoryStaging,
  type CreateCategoryData
} from '@/services/categoryService';

interface UseCategoryStagingReturn {
  // Data
  stagingCategories: CategoryStaging[];
  productionCategories: Category[];
  
  // State
  loading: boolean;
  error: string | null;
  success: string | null;
  isDirty: boolean;
  hasStaging: boolean;
  
  // Actions
  addCategory: (category: CreateCategoryData, isDeleted?: boolean) => void;
  editCategory: (id: string, category: CreateCategoryData) => void;
  deleteCategory: (id: string) => void;
  saveToStaging: () => Promise<void>;
  uploadToProduction: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearMessages: () => void;
}

export function useCategoryStaging(): UseCategoryStagingReturn {
  // State
  const [stagingCategories, setStagingCategories] = useState<CategoryStaging[]>([]);
  const [productionCategories, setProductionCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Check if we have staging data
  const hasStaging = stagingCategories.length > 0;

  // Load production categories
  const loadProductionCategories = useCallback(async () => {
    try {
      const categories = await categoryService.getCategories();
      setProductionCategories(categories);
    } catch (err) {
      console.error('Failed to load production categories:', err);
    }
  }, []);

  // Load staging categories
  const loadStagingCategories = useCallback(async () => {
    try {
      const categories = await categoryStagingService.getStagingCategories();
      setStagingCategories(categories);
    } catch (err) {
      console.error('Failed to load staging categories:', err);
    }
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadProductionCategories(),
        loadStagingCategories()
      ]);
      setIsDirty(false);
    } catch (err) {
      setError('Failed to refresh data');
      console.error('Failed to refresh data:', err);
    } finally {
      setLoading(false);
    }
  }, [loadProductionCategories, loadStagingCategories]);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Add new category to staging
  const addCategory = useCallback((categoryData: CreateCategoryData, isDeleted: boolean = false) => {
    const newCategory: CategoryStaging = {
      id: `temp-${Date.now()}-${Math.random()}`,
      ...categoryData,
      isDeleted,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setStagingCategories(prev => [...prev, newCategory]);
    setIsDirty(true);
  }, []);

  // Edit existing category in staging
  const editCategory = useCallback((id: string, categoryData: CreateCategoryData) => {
    // Check if this is a production item that needs to be converted to staging
    const productionItem = productionCategories.find(p => p.id === id);
    const stagingItem = stagingCategories.find(s => s.id === id);
    
    if (productionItem && !stagingItem) {
      // Check if there are actual changes before creating staging entry
      const hasChanges = 
        categoryData.name !== productionItem.name ||
        categoryData.description !== productionItem.description ||
        categoryData.parentId !== productionItem.parentId ||
        categoryData.isActive !== productionItem.isActive ||
        categoryData.sortOrder !== productionItem.sortOrder;

      if (hasChanges) {
        // Create a new staging entry from the production item
        const newStagingItem: CategoryStaging = {
          ...productionItem,
          isDeleted: false,
          updatedAt: new Date(),
          ...categoryData,
          slug: categoryData.slug || productionItem.slug,
        };
        
        setStagingCategories(prev => [...prev, newStagingItem]);
        setSuccess('Category updated successfully');
      } else {
        // No changes, just show a message
        setSuccess('No changes detected');
      }
    } else if (stagingItem) {
      // Check if there are actual changes before updating
      const hasChanges = 
        categoryData.name !== stagingItem.name ||
        categoryData.description !== stagingItem.description ||
        categoryData.parentId !== stagingItem.parentId ||
        categoryData.isActive !== stagingItem.isActive ||
        categoryData.sortOrder !== stagingItem.sortOrder;

      if (hasChanges) {
        // Update existing staging item
        setStagingCategories(prev => prev.map(item => 
          item.id === id 
            ? { 
                ...item, 
                ...categoryData, 
                slug: categoryData.slug || item.slug,
                updatedAt: new Date() 
              }
            : item
        ));
        setSuccess('Category updated successfully');
      } else {
        // No changes, just show a message
        setSuccess('No changes detected');
      }
    }
    
    setTimeout(() => setSuccess(null), 3000);
  }, [stagingCategories, productionCategories]);

  // Delete category (mark for deletion)
  const deleteCategory = useCallback((id: string) => {
    setStagingCategories(prev => 
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
      // Separate active and deleted categories
      const activeCategories = stagingCategories
        .filter(cat => !cat.isDeleted)
        .map(cat => ({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          parentId: cat.parentId,
          isActive: cat.isActive,
          sortOrder: cat.sortOrder,
        }));

      const deletedCategories = stagingCategories
        .filter(cat => cat.isDeleted)
        .map(cat => ({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          parentId: cat.parentId,
          isActive: cat.isActive,
          sortOrder: cat.sortOrder,
        }));

      // Update staging
      await categoryStagingService.updateStagingCategories(activeCategories, deletedCategories);
      
      // Refresh staging data
      await loadStagingCategories();
      
      setSuccess('Categories saved to staging successfully');
      setIsDirty(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save to staging';
      setError(errorMessage);
      console.error('Failed to save to staging:', err);
    } finally {
      setLoading(false);
    }
  }, [stagingCategories, loadStagingCategories]);

  // Upload to production
  const uploadToProduction = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await categoryProductionService.uploadToProduction();
      
      // Refresh all data
      await refreshData();
      
      setSuccess('Categories uploaded to production successfully');
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
    stagingCategories,
    productionCategories,
    
    // State
    loading,
    error,
    success,
    isDirty,
    hasStaging,
    
    // Actions
    addCategory,
    editCategory,
    deleteCategory,
    saveToStaging,
    uploadToProduction,
    refreshData,
    clearMessages,
  };
}
