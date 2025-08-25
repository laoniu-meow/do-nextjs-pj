import { useState, useCallback, useEffect } from "react";
import {
  Product,
  ProductStaging,
  CreateProductData,
  UpdateProductData,
} from "@/types";
import {
  productStagingService,
  productProductionService,
} from "@/services/productService";

export interface UseProductReturn {
  // Data
  stagingProducts: ProductStaging[];
  productionProducts: Product[];
  
  // State
  loading: boolean;
  error: string | null;
  success: string | null;
  isDirty: boolean;
  hasStaging: boolean;
  
  // Actions
  addProduct: (data: CreateProductData) => void;
  editProduct: (id: string, data: UpdateProductData) => void;
  deleteProduct: (id: string) => void;
  saveToStaging: () => Promise<void>;
  uploadToProduction: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearMessages: () => void;
}

export function useProduct(): UseProductReturn {
  // State
  const [stagingProducts, setStagingProducts] = useState<ProductStaging[]>([]);
  const [productionProducts, setProductionProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [hasStaging, setHasStaging] = useState(false);

  // Load staging products
  const loadStagingProducts = useCallback(async () => {
    try {
      const data = await productStagingService.getAll();
      setStagingProducts(data.filter(item => !item.isDeleted));
    } catch (err) {
      console.error('Failed to load staging products:', err);
      setError('Failed to load staging products');
    }
  }, []);

  // Load production products
  const loadProductionProducts = useCallback(async () => {
    try {
      const data = await productProductionService.getAll();
      setProductionProducts(data);
    } catch (err) {
      console.error('Failed to load production products:', err);
      setError('Failed to load production products');
    }
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStagingProducts(),
        loadProductionProducts(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [loadStagingProducts, loadProductionProducts]);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Check if data is dirty (has changes from production)
  const checkIfDirty = useCallback(() => {
    if (stagingProducts.length !== productionProducts.length) return true;

    return stagingProducts.some((staging) => {
      const production = productionProducts.find(p => p.id === staging.id);
      if (!production) return true;

      return (
        staging.productCode !== production.productCode ||
        staging.productName !== production.productName ||
        staging.description !== production.description ||
        staging.productTypeId !== production.productTypeId ||
        staging.sellingPrice !== production.sellingPrice ||
        staging.status !== production.status ||
        staging.categoryId !== production.categoryId ||
        JSON.stringify(staging.tags) !== JSON.stringify(production.tags) ||
        staging.stockLevel !== production.stockLevel ||
        staging.reorderPoint !== production.reorderPoint
      );
    });
  }, [stagingProducts, productionProducts]);

  // Update dirty state when data changes
  useEffect(() => {
    const dirty = checkIfDirty();
    setIsDirty(dirty);
    setHasStaging(stagingProducts.length > 0);
  }, [stagingProducts, productionProducts, checkIfDirty]);

  // Add new product to staging
  const addProduct = useCallback((productData: CreateProductData) => {
    const newProduct: ProductStaging = {
      id: `temp-${Date.now()}`,
      ...productData,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStagingProducts(prev => [...prev, newProduct]);
  }, []);

  // Edit existing product in staging
  const editProduct = useCallback((id: string, productData: UpdateProductData) => {
    setStagingProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...productData, updatedAt: new Date().toISOString() }
        : product
    ));
  }, []);

  // Delete product (mark as deleted)
  const deleteProduct = useCallback((id: string) => {
    setStagingProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, isDeleted: true, updatedAt: new Date().toISOString() }
        : product
    ));
  }, []);

  // Save to staging
  const saveToStaging = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Process each staging product
      for (const product of stagingProducts) {
        if (product.isDeleted) {
          // Delete from staging
          await productStagingService.delete(product.id);
        } else if (product.id.startsWith('temp-')) {
          // Create new product
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...createData } = product;
          await productStagingService.create(createData);
        } else {
          // Update existing product
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: productId, isDeleted, createdAt, ...updateData } = product;
          await productStagingService.update(productId, updateData);
        }
      }

      // Refresh data
      await refreshData();
      setSuccess('Products saved to staging successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save to staging';
      setError(errorMessage);
      console.error('Failed to save to staging:', err);
    } finally {
      setLoading(false);
    }
  }, [stagingProducts, refreshData]);

  // Upload to production
  const uploadToProduction = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await productStagingService.uploadToProduction();
      
      // Refresh all data
      await refreshData();
      
      setSuccess('Products uploaded to production successfully');
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
    stagingProducts,
    productionProducts,
    
    // State
    loading,
    error,
    success,
    isDirty,
    hasStaging,
    
    // Actions
    addProduct,
    editProduct,
    deleteProduct,
    saveToStaging,
    uploadToProduction,
    refreshData,
    clearMessages,
  };
}
