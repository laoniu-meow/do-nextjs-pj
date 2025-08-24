import { useState, useCallback, useEffect } from "react";
import {
  ProductType,
  ProductTypeStaging,
  CreateProductTypeData,
  UpdateProductTypeData,
} from "@/types";
import {
  productTypeStagingService,
  productTypeProductionService,
} from "@/services/productTypeService";

export interface UseProductTypeStagingReturn {
  // Data
  stagingProductTypes: ProductTypeStaging[];
  productionProductTypes: ProductType[];
  
  // State
  loading: boolean;
  error: string | null;
  success: string | null;
  isDirty: boolean;
  hasStaging: boolean;
  
  // Actions
  addProductType: (data: CreateProductTypeData) => void;
  editProductType: (id: string, data: UpdateProductTypeData) => void;
  deleteProductType: (id: string) => void;
  saveToStaging: () => Promise<void>;
  uploadToProduction: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearMessages: () => void;
}

export function useProductTypeStaging(): UseProductTypeStagingReturn {
  // State
  const [stagingProductTypes, setStagingProductTypes] = useState<ProductTypeStaging[]>([]);
  const [productionProductTypes, setProductionProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [hasStaging, setHasStaging] = useState(false);

  // Load staging product types
  const loadStagingProductTypes = useCallback(async () => {
    try {
      const data = await productTypeStagingService.getAll();
      setStagingProductTypes(data.filter(item => !item.isDeleted));
    } catch (err) {
      console.error('Failed to load staging product types:', err);
      setError('Failed to load staging product types');
    }
  }, []);

  // Load production product types
  const loadProductionProductTypes = useCallback(async () => {
    try {
      const data = await productTypeProductionService.getAll();
      setProductionProductTypes(data);
    } catch (err) {
      console.error('Failed to load production product types:', err);
      setError('Failed to load production product types');
    }
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStagingProductTypes(),
        loadProductionProductTypes(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [loadStagingProductTypes, loadProductionProductTypes]);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Check if data is dirty (has changes from production)
  const checkIfDirty = useCallback(() => {
    // Check if there are any staging items (including deleted ones)
    if (stagingProductTypes.length > 0) return true;
    
    // Check if there are any deleted items in production that need to be processed
    const hasDeletedItems = stagingProductTypes.some(item => item.isDeleted);
    if (hasDeletedItems) return true;
    
    // Check for new, modified items
    const hasChanges = stagingProductTypes.some(staging => {
      const production = productionProductTypes.find(p => p.id === staging.id);
      if (!production) return true; // New item
      
      return (
        staging.name !== production.name ||
        staging.description !== production.description ||
        staging.productCategoryId !== production.productCategoryId ||
        staging.isActive !== production.isActive ||
        staging.sortOrder !== production.sortOrder
      );
    });
    
    return hasChanges;
  }, [stagingProductTypes, productionProductTypes]);

  // Update isDirty and hasStaging
  useEffect(() => {
    const dirty = checkIfDirty();
    setIsDirty(dirty);
    setHasStaging(dirty);
    
    // Update localStorage for deleted items
    if (typeof window !== "undefined") {
      const deletedItems = stagingProductTypes.filter(item => item.isDeleted);
      if (deletedItems.length > 0) {
        localStorage.setItem("productTypeDeletedItems", JSON.stringify(deletedItems));
      } else {
        localStorage.removeItem("productTypeDeletedItems");
      }
    }
  }, [stagingProductTypes, productionProductTypes, checkIfDirty]);

  // Add product type
  const addProductType = useCallback((data: CreateProductTypeData) => {
    const id = crypto.randomUUID();
    const newProductType: ProductTypeStaging = {
      id,
      ...data,
      slug: data.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, ""),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };
    
    setStagingProductTypes(prev => [...prev, newProductType]);
    setSuccess('Product type added successfully');
    setTimeout(() => setSuccess(null), 3000);
  }, []);

  // Helper function to check if there are actual changes
  const hasChanges = useCallback((original: ProductType | ProductTypeStaging, updated: UpdateProductTypeData) => {
    return (
      (updated.name !== undefined && updated.name !== original.name) ||
      (updated.description !== undefined && updated.description !== original.description) ||
      (updated.productCategoryId !== undefined && updated.productCategoryId !== original.productCategoryId) ||
      (updated.isActive !== undefined && updated.isActive !== original.isActive) ||
      (updated.sortOrder !== undefined && updated.sortOrder !== original.sortOrder) ||
      (updated.isDeleted !== undefined && updated.isDeleted !== ("isDeleted" in original ? original.isDeleted : false))
    );
  }, []);

  // Edit product type
  const editProductType = useCallback((id: string, data: UpdateProductTypeData) => {
    // Check if this is a production item that needs to be converted to staging
    const productionItem = productionProductTypes.find(p => p.id === id);
    const stagingItem = stagingProductTypes.find(s => s.id === id);
    
    if (productionItem && !stagingItem) {
      // Check if there are actual changes before creating staging entry
      if (hasChanges(productionItem, data)) {
        // Create a new staging entry from the production item
        const newStagingItem: ProductTypeStaging = {
          ...productionItem,
          isDeleted: false,
          updatedAt: new Date().toISOString(),
          ...data,
          slug: data.name ? data.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") : productionItem.slug,
        };
        
        setStagingProductTypes(prev => [...prev, newStagingItem]);
        setSuccess('Product type updated successfully');
      } else {
        // No changes, just show a message
        setSuccess('No changes detected');
      }
    } else if (stagingItem) {
      // Check if there are actual changes before updating
      if (hasChanges(stagingItem, data)) {
        // Update existing staging item
        setStagingProductTypes(prev => prev.map(item => 
          item.id === id 
            ? { 
                ...item, 
                ...data, 
                slug: data.name ? data.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") : item.slug,
                updatedAt: new Date().toISOString() 
              }
            : item
        ));
        setSuccess('Product type updated successfully');
      } else {
        // No changes, just show a message
        setSuccess('No changes detected');
      }
    }
    
    setTimeout(() => setSuccess(null), 3000);
  }, [stagingProductTypes, productionProductTypes, hasChanges]);

  // Delete product type
  const deleteProductType = useCallback((id: string) => {
    // Check if this is a production item that needs to be converted to staging
    const productionItem = productionProductTypes.find(p => p.id === id);
    const stagingItem = stagingProductTypes.find(s => s.id === id);
    
    if (productionItem && !stagingItem) {
      // Create a new staging entry from the production item and mark as deleted
      const newStagingItem: ProductTypeStaging = {
        ...productionItem,
        isDeleted: true,
        updatedAt: new Date().toISOString(),
      };
      
      setStagingProductTypes(prev => [...prev, newStagingItem]);
    } else if (stagingItem) {
      // Update existing staging item
      setStagingProductTypes(prev => prev.map(item => 
        item.id === id 
          ? { ...item, isDeleted: true, updatedAt: new Date().toISOString() }
          : item
      ));
    }
    
    setSuccess('Product type marked for deletion');
    setTimeout(() => setSuccess(null), 3000);
  }, [stagingProductTypes, productionProductTypes]);

  // Save to staging
  const saveToStaging = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Save each staging item
      for (const item of stagingProductTypes) {
        if (item.isDeleted) {
          await productTypeStagingService.delete(item.id);
        } else if (productionProductTypes.find(p => p.id === item.id)) {
          await productTypeStagingService.update(item.id, {
            name: item.name,
            description: item.description,
            productCategoryId: item.productCategoryId,
            isActive: item.isActive,
            sortOrder: item.sortOrder,
          });
        } else {
          await productTypeStagingService.create({
            name: item.name,
            description: item.description,
            productCategoryId: item.productCategoryId!,
            isActive: item.isActive,
            sortOrder: item.sortOrder,
          });
        }
      }
      
      // Refresh staging data to get the updated state from the server
      await loadStagingProductTypes();
      
      setSuccess('Product types saved to staging successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save to staging';
      setError(errorMessage);
      console.error('Failed to save to staging:', err);
    } finally {
      setLoading(false);
    }
  }, [stagingProductTypes, productionProductTypes, loadStagingProductTypes]);

  // Upload to production
  const uploadToProduction = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await productTypeStagingService.uploadToProduction();
      
      // Refresh all data
      await refreshData();
      
      setSuccess('Product types uploaded to production successfully');
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
    stagingProductTypes,
    productionProductTypes,
    
    // State
    loading,
    error,
    success,
    isDirty,
    hasStaging,
    
    // Actions
    addProductType,
    editProductType,
    deleteProductType,
    saveToStaging,
    uploadToProduction,
    refreshData,
    clearMessages,
  };
}
