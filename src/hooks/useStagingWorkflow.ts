import { useState, useCallback } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export interface StagingWorkflowConfig<T> {
  type: string;
  apiEndpoints: {
    staging: string;
    production: string;
    loadFrom?: string; // Optional endpoint for loading production data
  };
  validation?: (item: T) => boolean;
}

export interface StagingWorkflowResult<T> {
  // State
  items: T[];
  isDirty: boolean;
  hasStaging: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
  
  // Actions
  setItems: (items: T[]) => void;
  addItem: (item: T) => void;
  editItem: (id: string, updates: Partial<T>) => void;
  deleteItem: (id: string) => void;
  saveToStaging: () => Promise<boolean>;
  uploadToProduction: () => Promise<boolean>;
  refreshData: () => Promise<void>;
  clearMessages: () => void;
  setError: (error: string | null) => void;
}

export function useStagingWorkflow<T extends { 
  id: string;
}>(
  config: StagingWorkflowConfig<T>
): StagingWorkflowResult<T> {
  // State
  const [items, setItems] = useState<T[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [hasStaging, setHasStaging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clear messages after timeout
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // Add item to local state
  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
    setIsDirty(true);
    setSuccess(`${config.type} added to staging`);
    setTimeout(clearMessages, 3000);
  }, [config.type, clearMessages]);

  // Edit item in local state
  const editItem = useCallback((id: string, updates: Partial<T>) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updates }
          : item
      )
    );
    setIsDirty(true);
    setSuccess(`${config.type} updated in staging`);
    setTimeout(clearMessages, 3000);
  }, [config.type, clearMessages]);

  // Refresh data (Hybrid: Check staging first, then compare with production for smart detection)
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // First try to load from staging (to see your work)
      const stagingRes = await fetchWithAuth(config.apiEndpoints.staging);
      let stagingData = null;
      
      if (stagingRes.ok) {
        try {
          const parsed = await stagingRes.json();
          console.warn(`[${config.type}] Staging response:`, parsed);
          if (parsed.success && parsed.data && parsed.data.length > 0) {
            stagingData = parsed.data;
            console.warn(`[${config.type}] Staging data found:`, stagingData.length, 'items', stagingData);
          } else {
            console.warn(`[${config.type}] No staging data or empty staging`);
          }
        } catch (parseError) {
          console.warn(`[${config.type}] Could not parse staging response as JSON:`, parseError);
        }
      } else {
        console.warn(`[${config.type}] Staging request failed:`, stagingRes.status, stagingRes.statusText);
      }

      // Load production data for comparison
      const loadEndpoint = config.apiEndpoints.loadFrom || config.apiEndpoints.staging.replace('/staging', '');
      const response = await fetchWithAuth(loadEndpoint);
      if (!response.ok) {
        throw new Error(`Failed to load ${config.type}s from production`);
      }
      
      let productionData: T[];
      try {
        const data = await response.json();
        productionData = data[config.type === 'tax' ? 'data' : config.type + 's'] || [];
        console.warn(`[${config.type}] Production response:`, data);
        console.warn(`[${config.type}] Production data loaded:`, productionData.length, 'items', productionData);
      } catch (parseError) {
        console.error(`[${config.type}] Could not parse production response as JSON:`, parseError);
        throw new Error(`Failed to parse ${config.type}s data from production`);
      }

      // Smart detection: Check if staging data is actually different/newer
      if (stagingData && stagingData.length > 0) {
        // Compare staging vs production data
        const productionIds = new Set(productionData.map((item: T) => item.id));
        const stagingIds = new Set(stagingData.map((item: T) => item.id));
        
        // Check if staging has different content (not just different IDs)
        console.warn(`[${config.type}] Comparing staging vs production data:`);
        console.warn(`[${config.type}] Staging IDs:`, Array.from(stagingIds));
        console.warn(`[${config.type}] Production IDs:`, Array.from(productionIds));
        
        const hasDifferentContent = stagingData.some((stagingItem: T) => {
          const productionItem = productionData.find((p: T) => p.id === stagingItem.id);
          if (!productionItem) {
            console.warn(`[${config.type}] Staging item not in production (new):`, stagingItem.id);
            return true; // New item in staging
          }
          
          // Compare key fields (excluding auto-generated fields like id, createdAt, updatedAt)
          // For tax settings, compare specific fields; for others, do basic comparison
          let isDifferent = false;
          
          // Generic comparison for all types using JSON.stringify
          // This avoids type issues while still providing accurate comparison
          isDifferent = JSON.stringify(stagingItem) !== JSON.stringify(productionItem);
          
          if (isDifferent) {
            console.warn(`[${config.type}] Staging item differs from production:`, stagingItem.id, {
              staging: stagingItem,
              production: productionItem
            });
          }
          
          return isDifferent;
        });
        
        const hasDifferentIds = stagingIds.size !== productionIds.size || 
                               !Array.from(stagingIds).every((id) => productionIds.has(id as string));
        
        console.warn(`[${config.type}] Comparison results:`, {
          hasDifferentContent,
          hasDifferentIds,
          stagingCount: stagingIds.size,
          productionCount: productionIds.size
        });
        
        if (hasDifferentContent || hasDifferentIds) {
          console.warn(`[${config.type}] Staging data is different from production, showing staging`);
          setItems(stagingData);
          setHasStaging(true);
          setIsDirty(true);
          setLoading(false);
          return;
        } else {
          console.warn(`[${config.type}] Staging data is identical to production (stale), showing production`);
          // Staging data is stale, clear it and show production
          setItems(productionData);
          setHasStaging(false);
          setIsDirty(false);
        }
      } else {
        // No staging data, show production
        console.warn(`[${config.type}] No staging data, showing production`);
        setItems(productionData);
        setHasStaging(false);
        setIsDirty(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to load ${config.type}s`);
    } finally {
      setLoading(false);
    }
  }, [config.apiEndpoints.staging, config.apiEndpoints.loadFrom, config.type]);

  // Delete item from local state and API
  const deleteItem = useCallback(async (id: string) => {
    try {
      console.warn(`[${config.type}] Attempting to delete item with ID:`, id);
      
      // Store the item to be deleted for potential rollback
      const itemToDelete = items.find(item => item.id === id);
              if (!itemToDelete) {
          console.error(`[${config.type}] Item not found for deletion:`, id);
          console.warn(`[${config.type}] Available items:`, items.map(item => ({ id: item.id })));
          // If item doesn't exist in local state, refresh data to sync with database
          console.warn(`[${config.type}] Item not found in local state, refreshing data to sync with database`);
          refreshData();
          return; // Exit early without throwing error
        }

      console.warn(`[${config.type}] Item found, removing from local state:`, itemToDelete);

      // First remove from local state for immediate UI feedback
      setItems(prev => prev.filter(item => item.id !== id));
      setIsDirty(true);
      
      // Construct the correct URL based on API structure
      // Tax settings use query parameters (?id=), suppliers use path parameters (/${id})
      let deleteUrl: string;
      if (config.type === 'tax') {
        // Tax settings use query parameters
        deleteUrl = `${config.apiEndpoints.staging}?id=${id}`;
      } else {
        // Suppliers and other types use path parameters
        deleteUrl = `${config.apiEndpoints.staging}/${id}`;
      }
      
      console.warn(`[${config.type}] Calling DELETE API:`, deleteUrl);
      console.warn(`[${config.type}] Full URL:`, deleteUrl);
      console.warn(`[${config.type}] Config staging endpoint:`, config.apiEndpoints.staging);
      
      // Then call the DELETE API
      const response = await fetchWithAuth(deleteUrl, {
        method: 'DELETE',
      });

      console.warn(`[${config.type}] DELETE API response:`, response.status, response.statusText);
      console.warn(`[${config.type}] Response headers:`, Object.fromEntries(response.headers.entries()));
      console.warn(`[${config.type}] Response URL:`, response.url);

      if (!response.ok) {
        // If it's a 404 (record not found), handle it gracefully
        if (response.status === 404) {
          console.warn(`[${config.type}] Record not found in database, removing from UI`);
          // Remove item from local state since it doesn't exist in database
          setItems(prev => prev.filter(item => item.id !== id));
          setSuccess(`${config.type} removed (was already deleted from database)`);
          setTimeout(clearMessages, 3000);
          // Don't refresh data immediately - the item is already removed from UI
          // If there are other sync issues, the user can manually refresh
          return; // Exit early without throwing error
        }

        // For other errors, revert the local state change and show error
        console.error(`[${config.type}] DELETE API failed, reverting local state`);
        setItems(prev => [...prev, itemToDelete]);
        setIsDirty(false);
        
        // Try to parse JSON response, but handle non-JSON responses gracefully
        let errorMessage = `Failed to remove ${config.type} from staging (${response.status} ${response.statusText})`;
        try {
          const data = await response.json();
          if (data.error) {
            errorMessage = data.error;
          }
        } catch (parseError) {
          console.warn(`[${config.type}] Could not parse error response as JSON:`, parseError);
          // If we can't parse JSON, use the status text or a generic message
        }
        
        throw new Error(errorMessage);
      }

      console.warn(`[${config.type}] DELETE API successful`);
      setSuccess(`${config.type} removed from staging`);
      setTimeout(clearMessages, 3000);
    } catch (err) {
      console.error(`[${config.type}] Error in deleteItem:`, err);
      const message = err instanceof Error ? err.message : `Failed to remove ${config.type} from staging`;
      setError(message);
    }
  }, [config.type, clearMessages, config.apiEndpoints.staging, items, refreshData]);

  // Save items to staging
  const saveToStaging = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchWithAuth(config.apiEndpoints.staging, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          [config.type === 'tax' ? 'settings' : config.type + 's']: items 
        }),
      });

      if (!response.ok) {
        // Try to parse JSON response, but handle non-JSON responses gracefully
        let errorMessage = `Failed to save ${config.type}s to staging (${response.status} ${response.statusText})`;
        try {
          const data = await response.json();
          if (data.error) {
            errorMessage = data.error;
          }
        } catch (parseError) {
          console.warn(`[${config.type}] Could not parse error response as JSON:`, parseError);
          // If we can't parse JSON, use the status text or a generic message
        }
        
        throw new Error(errorMessage);
      }

      setHasStaging(true);
      setIsDirty(false);
      setSuccess(`${config.type}s saved to staging successfully. Upload button is now enabled.`);
      setTimeout(clearMessages, 3000);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to save ${config.type}s to staging`;
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [items, config.apiEndpoints.staging, config.type, clearMessages]);

  // Upload items from staging to production
  const uploadToProduction = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchWithAuth(config.apiEndpoints.production, {
        method: 'POST',
      });

      if (!response.ok) {
        // Try to parse JSON response, but handle non-JSON responses gracefully
        let errorMessage = `Failed to upload ${config.type}s to production (${response.status} ${response.statusText})`;
        try {
          const data = await response.json();
          if (data.error) {
            errorMessage = data.error;
          }
        } catch (parseError) {
          console.warn(`[${config.type}] Could not parse error response as JSON:`, parseError);
          // If we can't parse JSON, use the status text or a generic message
        }
        
        throw new Error(errorMessage);
      }

      // Clear staging state and local items
      console.warn(`[${config.type}] Upload successful, clearing staging state`);
      setHasStaging(false);
      setIsDirty(false);
      setItems([]); // Clear local items since they're now in production
      setSuccess(`${config.type}s uploaded to production successfully`);
      setTimeout(clearMessages, 3000);
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to upload ${config.type}s to production`;
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [config.apiEndpoints.production, config.type, clearMessages]);



  return {
    // State
    items,
    isDirty,
    hasStaging,
    loading,
    error,
    success,
    
    // Actions
    setItems,
    addItem,
    editItem,
    deleteItem,
    saveToStaging,
    uploadToProduction,
    refreshData,
    clearMessages,
    setError,
  };
}
