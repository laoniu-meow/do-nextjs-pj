"use client";

/**
 * Admin Products Management Page
 *
 * Tab Structure (Logical Order):
 * Tab 0: Variants - Product variants and inventory management
 * Tab 1: Products - Main product management
 * Tab 2: Product Types - Product type classification (e.g., Physical, Digital, Service)
 * Tab 3: Product Categories - Product category hierarchy
 * Tab 4: Categories - General category management
 * Tab 5: Promotions - Discount and promotion rules
 * Tab 6: Suppliers - Supplier and vendor management
 * Tab 7: Tax - Tax rules and settings
 *
 * This logical arrangement groups related functionality together:
 * - Product-related: Variants (0) → Products (1) → Product Types (2) → Product Categories (3)
 * - System-wide: Categories (4) → Promotions (5) → Suppliers (6) → Tax (7)
 */

import React from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";
import {
  Card,
  Tabs,
  Tab,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { alpha } from "@mui/material/styles";
import TaxSettings, {
  TaxRuleRecord,
  TaxRuleInput,
} from "@/components/shop/TaxSettings";
import SupplierWorkflow, {
  SupplierWorkflowRef,
} from "./components/SupplierWorkflow";
import PromotionWorkflow, {
  PromotionWorkflowRef,
} from "./components/PromotionWorkflow";
import CategoryWorkflow, {
  CategoryWorkflowRef,
} from "./components/CategoryWorkflow";
import ProductCategoryWorkflow, {
  ProductCategoryWorkflowRef,
} from "./components/ProductCategoryWorkflow";
import ProductTypeWorkflow, {
  ProductTypeWorkflowRef,
} from "./components/ProductTypeWorkflow";
import ProductWorkflow, {
  ProductWorkflowRef,
} from "./components/ProductWorkflow";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function AdminProductsPage() {
  const [tab, setTab] = React.useState(() => {
    // Try to restore the last active tab from localStorage
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("adminProductsActiveTab");
      if (savedTab !== null) {
        const tabIndex = parseInt(savedTab, 10);
        // Ensure the tab index is valid (0-8)
        if (tabIndex >= 0 && tabIndex <= 8) {
          return tabIndex;
        }
      }
    }
    return 7; // Default to Tax tab (index 7)
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    // Save the current tab to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("adminProductsActiveTab", newValue.toString());
    }
  };

  // Tax rules state management
  const [taxRules, setTaxRules] = React.useState<TaxRuleRecord[]>([]);
  const [originalRules, setOriginalRules] = React.useState<TaxRuleRecord[]>([]);
  const [deletedRules, setDeletedRules] = React.useState<TaxRuleRecord[]>([]);
  const [isDirty, setIsDirty] = React.useState(false);
  const [hasStagingData, setHasStagingData] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasUploadedToProduction, setHasUploadedToProduction] =
    React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Supplier message state
  const [supplierMessage, setSupplierMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Promotion message state
  const [promotionMessage, setPromotionMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Category message state
  const [categoryMessage, setCategoryMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Product Category message state
  const [productCategoryMessage, setProductCategoryMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Product Type message state
  const [productTypeMessage, setProductTypeMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Product message state
  const [productMessage, setProductMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Memoize the supplier message setter to prevent unnecessary re-renders
  const setSupplierMessageCallback = React.useCallback(
    (
      message: {
        type: "success" | "error";
        text: string;
      } | null
    ) => {
      setSupplierMessage(message);
    },
    []
  );

  // Memoize the promotion message setter to prevent unnecessary re-renders
  const setPromotionMessageCallback = React.useCallback(
    (
      message: {
        type: "success" | "error";
        text: string;
      } | null
    ) => {
      setPromotionMessage(message);
    },
    []
  );

  // Memoize the category message setter to prevent unnecessary re-renders
  const setCategoryMessageCallback = React.useCallback(
    (
      message: {
        type: "success" | "error";
        text: string;
      } | null
    ) => {
      setCategoryMessage(message);
    },
    []
  );

  const setProductCategoryMessageCallback = React.useCallback(
    (
      message: {
        type: "success" | "error";
        text: string;
      } | null
    ) => {
      setProductCategoryMessage(message);
    },
    []
  );

  // Supplier button state management (controlled by SupplierWorkflow component)
  const [supplierSaveDisabled, setSupplierSaveDisabled] = React.useState(true);
  const [supplierUploadDisabled, setSupplierUploadDisabled] =
    React.useState(true);
  const supplierWorkflowRef = React.useRef<SupplierWorkflowRef>(null);

  // Promotion button state management (controlled by PromotionWorkflow component)
  const [promotionSaveDisabled, setPromotionSaveDisabled] =
    React.useState(true);
  const [promotionUploadDisabled, setPromotionUploadDisabled] =
    React.useState(true);
  const promotionWorkflowRef = React.useRef<PromotionWorkflowRef>(null);

  // Category button state management (controlled by CategoryWorkflow component)
  const [categorySaveDisabled, setCategorySaveDisabled] = React.useState(true);
  const [categoryUploadDisabled, setCategoryUploadDisabled] =
    React.useState(true);

  // Product Category button state management (controlled by ProductCategoryWorkflow component)
  const [productCategorySaveDisabled, setProductCategorySaveDisabled] =
    React.useState(true);
  const [productCategoryUploadDisabled, setProductCategoryUploadDisabled] =
    React.useState(true);
  const categoryWorkflowRef = React.useRef<CategoryWorkflowRef>(null);
  const productCategoryWorkflowRef =
    React.useRef<ProductCategoryWorkflowRef>(null);

  // Product Type workflow state
  const [productTypeSaveDisabled, setProductTypeSaveDisabled] =
    React.useState(true);
  const [productTypeUploadDisabled, setProductTypeUploadDisabled] =
    React.useState(true);
  const productTypeWorkflowRef = React.useRef<ProductTypeWorkflowRef>(null);

  // Product workflow state
  const [productSaveDisabled, setProductSaveDisabled] = React.useState(true);
  const [productUploadDisabled, setProductUploadDisabled] =
    React.useState(true);
  const productWorkflowRef = React.useRef<ProductWorkflowRef>(null);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(() => {
    // Try to restore modal state from localStorage
    if (typeof window !== "undefined") {
      const savedModalState = localStorage.getItem(
        "adminProductsEditModalOpen"
      );
      return savedModalState === "true";
    }
    return false;
  });
  const [editingRule, setEditingRule] = React.useState<TaxRuleRecord | null>(
    null
  );
  const [editForm, setEditForm] = React.useState<TaxRuleInput>(() => {
    // Try to restore edit form from localStorage
    if (typeof window !== "undefined") {
      const savedForm = localStorage.getItem("adminProductsEditForm");
      if (savedForm) {
        try {
          const parsed = JSON.parse(savedForm);
          if (parsed && typeof parsed === "object") {
            return {
              description: parsed.description || "",
              ratePercent: parsed.ratePercent || "0",
              isInclusive: Boolean(parsed.isInclusive),
              isGST: Boolean(parsed.isGST),
            };
          }
        } catch (e) {
          console.warn("Failed to parse saved edit form:", e);
        }
      }
    }
    return {
      description: "",
      ratePercent: "0",
      isInclusive: false,
      isGST: false,
    };
  });

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(() => {
    // Try to restore delete modal state from localStorage
    if (typeof window !== "undefined") {
      const savedModalState = localStorage.getItem(
        "adminProductsDeleteModalOpen"
      );
      return savedModalState === "true";
    }
    return false;
  });
  const [deletingRule, setDeletingRule] = React.useState<TaxRuleRecord | null>(
    null
  );

  // Persist tab selection and scroll position
  React.useEffect(() => {
    // Save current tab to localStorage whenever it changes
    if (typeof window !== "undefined") {
      localStorage.setItem("adminProductsActiveTab", tab.toString());
    }
  }, [tab]);

  // Save scroll position on scroll events
  React.useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        const scrollPosition = window.scrollY;
        localStorage.setItem(
          "adminProductsScrollPosition",
          scrollPosition.toString()
        );
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Restore scroll position on page load
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedScrollPosition = localStorage.getItem(
        "adminProductsScrollPosition"
      );
      if (savedScrollPosition) {
        const scrollPosition = parseInt(savedScrollPosition, 10);
        // Use setTimeout to ensure the page is fully rendered before scrolling
        setTimeout(() => {
          window.scrollTo(0, scrollPosition);
        }, 100);
      }
    }
  }, []); // Only run once on mount

  // Save edit form to localStorage whenever it changes
  React.useEffect(() => {
    if (typeof window !== "undefined" && isEditModalOpen) {
      localStorage.setItem("adminProductsEditForm", JSON.stringify(editForm));
    }
  }, [editForm, isEditModalOpen]);

  // Save modal state to localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "adminProductsEditModalOpen",
        isEditModalOpen.toString()
      );
    }
  }, [isEditModalOpen]);

  // Save delete modal state to localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "adminProductsDeleteModalOpen",
        isDeleteModalOpen.toString()
      );
    }
  }, [isDeleteModalOpen]);

  // Check if data has changed from original
  const checkIfDirty = React.useCallback(
    (currentRules: TaxRuleRecord[]) => {
      if (currentRules.length !== originalRules.length) return true;

      // Use find() instead of array indexing to avoid object injection
      return currentRules.some((current) => {
        const original = originalRules.find((orig) => orig.id === current.id);
        if (!original) return true;

        return (
          current.description !== original.description ||
          current.ratePercent !== original.ratePercent ||
          current.isInclusive !== original.isInclusive ||
          current.isGST !== original.isGST
        );
      });
    },
    [originalRules]
  );

  const handleAddTax = React.useCallback(
    (input: TaxRuleInput) => {
      // Validate required fields before adding
      if (!input.description || input.description.trim() === "") {
        setMessage({
          type: "error",
          text: "Description is required for tax rules",
        });
        return;
      }

      if (
        !input.ratePercent ||
        input.ratePercent.trim() === "" ||
        Number.parseFloat(input.ratePercent) <= 0
      ) {
        setMessage({
          type: "error",
          text: "Valid tax rate is required (must be greater than 0)",
        });
        return;
      }

      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);
      const newRules = [...taxRules, { id, ...input }];
      setTaxRules(newRules);
      setIsDirty(checkIfDirty(newRules));
      setHasUploadedToProduction(false); // Reset flag when new changes are made

      // Show success message
      setMessage({ type: "success", text: "Tax rule added successfully" });
    },
    [taxRules, checkIfDirty]
  );

  const handleRemoveTax = React.useCallback(
    (id: string) => {
      const found = taxRules.find((r) => r.id === id);
      if (!found) return;

      // Show delete confirmation dialog
      setDeletingRule(found);
      setIsDeleteModalOpen(true);
    },
    [taxRules]
  );

  // Save deleted rules to localStorage
  const saveDeletedRulesToStorage = React.useCallback(
    (rules: TaxRuleRecord[]) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("taxDeletedRules", JSON.stringify(rules));
        } catch (error) {
          console.error("Failed to save deleted rules to localStorage:", error);
        }
      }
    },
    []
  );

  const handleConfirmDelete = React.useCallback(() => {
    if (!deletingRule) return;

    // Mark rule for deletion (staging workflow)
    const newRules = taxRules.filter((r) => r.id !== deletingRule.id);
    setTaxRules(newRules);

    // Track deleted rule for potential restoration
    const newDeletedRules = [...deletedRules, deletingRule];
    setDeletedRules(newDeletedRules);
    saveDeletedRulesToStorage(newDeletedRules);

    setIsDirty(checkIfDirty(newRules));
    setHasUploadedToProduction(false); // Reset flag when changes are made

    // Close modal and reset state
    setIsDeleteModalOpen(false);
    setDeletingRule(null);

    // Clear saved delete modal state from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminProductsDeleteModalOpen");
    }

    // Show message that deletion is staged
    setMessage({
      type: "success",
      text: "Tax rule deleted. Click Save to stage changes, then Upload to production.",
    });
  }, [
    deletingRule,
    taxRules,
    checkIfDirty,
    deletedRules,
    saveDeletedRulesToStorage,
  ]);

  const handleCancelDelete = React.useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingRule(null);

    // Clear saved delete modal state from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminProductsDeleteModalOpen");
    }
  }, []);

  const handleEditTax = React.useCallback(
    (id: string) => {
      const found = taxRules.find((r) => r.id === id);
      if (!found) return;

      // Open edit modal with current values
      setEditingRule(found);
      setEditForm({
        description: found.description || "",
        ratePercent: found.ratePercent,
        isInclusive: found.isInclusive,
        isGST: found.isGST,
      });
      setIsEditModalOpen(true);
    },
    [taxRules]
  );

  const handleSaveEdit = React.useCallback(() => {
    if (!editingRule) return;

    // Validate edited data before saving
    if (!editForm.description || editForm.description.trim() === "") {
      setMessage({
        type: "error",
        text: "Description is required for tax rules",
      });
      return;
    }

    if (
      !editForm.ratePercent ||
      editForm.ratePercent.trim() === "" ||
      Number.parseFloat(editForm.ratePercent) <= 0
    ) {
      setMessage({
        type: "error",
        text: "Valid tax rate is required (must be greater than 0)",
      });
      return;
    }

    // Update the rule with edited values
    const newRules = taxRules.map((r) =>
      r.id === editingRule.id
        ? {
            ...r,
            description: editForm.description || undefined,
            ratePercent: editForm.ratePercent,
            isInclusive: editForm.isInclusive,
            isGST: editForm.isGST,
          }
        : r
    );

    setTaxRules(newRules);
    setIsDirty(checkIfDirty(newRules));
    setHasUploadedToProduction(false); // Reset flag when changes are made
    setIsEditModalOpen(false);
    setEditingRule(null);
    setEditForm({
      description: "",
      ratePercent: "0",
      isInclusive: false,
      isGST: false,
    });

    // Clear saved edit form and modal state from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminProductsEditForm");
      localStorage.removeItem("adminProductsEditModalOpen");
    }

    // Show success message
    setMessage({ type: "success", text: "Tax rule updated successfully" });
  }, [editingRule, editForm, taxRules, checkIfDirty]);

  const handleCancelEdit = React.useCallback(() => {
    setIsEditModalOpen(false);
    setEditingRule(null);
    setEditForm({
      description: "",
      ratePercent: "0",
      isInclusive: false,
      isGST: false,
    });

    // Clear saved edit form and modal state from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminProductsEditForm");
      localStorage.removeItem("adminProductsEditModalOpen");
    }
  }, []);

  // Restore deleted rule from staging
  const handleRestoreRule = React.useCallback(
    (deletedRule: TaxRuleRecord) => {
      // Remove from deleted rules
      const newDeletedRules = deletedRules.filter(
        (r) => r.id !== deletedRule.id
      );
      setDeletedRules(newDeletedRules);
      saveDeletedRulesToStorage(newDeletedRules);

      // Add back to active rules
      const newRules = [...taxRules, deletedRule];
      setTaxRules(newRules);
      setIsDirty(checkIfDirty(newRules));
      setHasUploadedToProduction(false); // Reset flag when changes are made

      // Show success message
      setMessage({
        type: "success",
        text: "Tax rule restored successfully. Click Save to update staging.",
      });
    },
    [deletedRules, taxRules, checkIfDirty, saveDeletedRulesToStorage]
  );

  // Load data using hybrid method: check staging first, then production
  // When loading from staging: deleted rules come from API response first, localStorage as fallback
  // When loading from production: deleted rules are permanently cleared FOREVER
  // After successful upload, we skip staging completely to prevent deleted rules from reappearing
  const loadTaxData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // If we've successfully uploaded to production, skip staging completely
      if (hasUploadedToProduction) {
        console.warn(
          "Skipping staging check - loading directly from production (deleted rules are gone forever)"
        );
        // Load directly from production
        const productionRes = await fetchWithAuth(
          "/api/shop/tax-settings/production",
          {
            cache: "no-store",
          }
        );

        // Handle production response
        if (!productionRes.ok) {
          throw new Error(`Production API error: ${productionRes.status}`);
        }

        let productionJson;
        try {
          const productionText = await productionRes.text();
          if (!productionText.trim()) {
            throw new Error("Empty response from production API");
          }
          productionJson = JSON.parse(productionText);
        } catch (parseError) {
          console.error("Failed to parse production response:", parseError);
          throw new Error("Invalid JSON response from production API");
        }

        if (productionJson.success) {
          const loaded: TaxRuleRecord[] = (productionJson.data || []).map(
            (r: Record<string, unknown>) => ({
              id: r.id as string,
              description: r.description as string | undefined,
              ratePercent: String(r.ratePercent),
              isInclusive: Boolean(r.isInclusive),
              isGST: Boolean(r.isGST),
            })
          );
          setTaxRules(loaded);
          setOriginalRules(loaded);
          setIsDirty(false);
          setHasStagingData(false);

          // Production is authoritative - permanently clear all deleted rules FOREVER
          setDeletedRules([]);

          // Force clear localStorage completely when loading from production
          if (typeof window !== "undefined") {
            localStorage.removeItem("taxDeletedRules");
            localStorage.removeItem("taxDeletedRules_backup");
            // Clear any other potential variations
            Object.keys(localStorage).forEach((key) => {
              if (
                key.includes("taxDeletedRules") ||
                key.includes("deletedRules")
              ) {
                localStorage.removeItem(key);
              }
            });
          }

          return; // Exit early, don't check staging
        }
      }

      // Step 1: Check if staging table has data
      const stagingRes = await fetchWithAuth(
        "/api/admin/products/tax/staging",
        {
          cache: "no-store",
        }
      );

      // Check if response is valid
      if (!stagingRes.ok) {
        throw new Error(`Staging API error: ${stagingRes.status}`);
      }

      let stagingJson;
      try {
        const stagingText = await stagingRes.text();
        if (!stagingText.trim()) {
          throw new Error("Empty response from staging API");
        }
        stagingJson = JSON.parse(stagingText);
      } catch (parseError) {
        console.error("Failed to parse staging response:", parseError);
        throw new Error("Invalid JSON response from staging API");
      }

      if (
        stagingJson.success &&
        stagingJson.data &&
        (stagingJson.data.length > 0 ||
          (stagingJson.deletedRules && stagingJson.deletedRules.length > 0))
      ) {
        // Step 2: If staging has data (active OR deleted rules), fetch from staging and enable upload button
        const loaded: TaxRuleRecord[] = stagingJson.data.map(
          (r: Record<string, unknown>) => ({
            id: r.id as string,
            description: r.description as string | undefined,
            ratePercent: String(r.ratePercent),
            isInclusive: Boolean(r.isInclusive),
            isGST: Boolean(r.isGST),
          })
        );
        setTaxRules(loaded);
        setOriginalRules(loaded);
        // Keep Save button ENABLED when loading from staging (user can make more changes)
        // setIsDirty(false); // ❌ REMOVED: Don't disable Save button when loading staging
        setHasStagingData(true);

        // When loading from staging, get deleted rules from API response first, then fallback to localStorage
        let stagingDeletedRules: TaxRuleRecord[] = [];

        // First, try to get deleted rules from the staging API response
        if (
          stagingJson.deletedRules &&
          Array.isArray(stagingJson.deletedRules)
        ) {
          stagingDeletedRules = stagingJson.deletedRules.map(
            (r: Record<string, unknown>) => ({
              id: r.id as string,
              description: r.description as string | undefined,
              ratePercent: String(r.ratePercent),
              isInclusive: Boolean(r.isInclusive),
              isGST: Boolean(r.isGST),
            })
          );
        }

        // If no deleted rules from API, try localStorage as fallback
        if (stagingDeletedRules.length === 0 && typeof window !== "undefined") {
          try {
            const saved = localStorage.getItem("taxDeletedRules");
            if (saved) {
              const restored = JSON.parse(saved);
              if (Array.isArray(restored) && restored.length > 0) {
                stagingDeletedRules = restored;
                console.warn(
                  "Fallback: Restored deleted rules from localStorage:",
                  restored.length,
                  "rules"
                );
              }
            }
          } catch (error) {
            console.error(
              "Failed to restore deleted rules from localStorage:",
              error
            );
          }
        }

        // Set the deleted rules (either from API or localStorage)
        setDeletedRules(stagingDeletedRules);

        // Update localStorage to match what we loaded
        if (typeof window !== "undefined" && stagingDeletedRules.length > 0) {
          localStorage.setItem(
            "taxDeletedRules",
            JSON.stringify(stagingDeletedRules)
          );
        }
      } else {
        // Step 3: If no staging data, fetch from production table
        const productionRes = await fetchWithAuth(
          "/api/shop/tax-settings/production",
          {
            cache: "no-store",
          }
        );

        // Check if production response is valid
        if (!productionRes.ok) {
          throw new Error(`Production API error: ${productionRes.status}`);
        }

        let productionJson;
        try {
          const productionText = await productionRes.text();
          if (!productionText.trim()) {
            throw new Error("Empty response from production API");
          }
          productionJson = JSON.parse(productionText);
        } catch (parseError) {
          console.error("Failed to parse production response:", parseError);
          throw new Error("Invalid JSON response from production API");
        }

        if (productionJson.success) {
          const loaded: TaxRuleRecord[] = (productionJson.data || []).map(
            (r: Record<string, unknown>) => ({
              id: r.id as string,
              description: r.description as string | undefined,
              ratePercent: String(r.ratePercent),
              isInclusive: Boolean(r.isInclusive),
              isGST: Boolean(r.isGST),
            })
          );
          setTaxRules(loaded);
          setOriginalRules(loaded);
          setIsDirty(false);
          setHasStagingData(false);

          // Production is authoritative - permanently clear all deleted rules
          setDeletedRules([]);

          // Force clear localStorage completely when loading from production
          if (typeof window !== "undefined") {
            localStorage.removeItem("taxDeletedRules");
            localStorage.removeItem("taxDeletedRules_backup");
            // Clear any other potential variations
            Object.keys(localStorage).forEach((key) => {
              if (
                key.includes("taxDeletedRules") ||
                key.includes("deletedRules")
              ) {
                localStorage.removeItem(key);
              }
            });
          }
        } else {
          console.warn(
            "Failed to load production tax rules:",
            productionJson.error || productionRes.status
          );
          setTaxRules([]);
          setOriginalRules([]);
          setIsDirty(false);
          setHasStagingData(false);

          // Clear deleted rules on error
          setDeletedRules([]);

          // Force clear localStorage completely on error
          if (typeof window !== "undefined") {
            localStorage.removeItem("taxDeletedRules");
            localStorage.removeItem("taxDeletedRules_backup");
            // Clear any other potential variations
            Object.keys(localStorage).forEach((key) => {
              if (
                key.includes("taxDeletedRules") ||
                key.includes("deletedRules")
              ) {
                localStorage.removeItem(key);
              }
            });
          }

          // Double safety: ensure deleted rules are never restored on error
          console.warn(
            "Error occurred - deleted rules are permanently cleared"
          );
        }
      }
    } catch (e) {
      console.error("Failed to load tax data:", e);
      setMessage({
        type: "error",
        text: `Failed to load tax data: ${
          e instanceof Error ? e.message : "Unknown error"
        }`,
      });
      setTaxRules([]);
      setOriginalRules([]);
      setIsDirty(false);
      setHasStagingData(false);
    } finally {
      setIsLoading(false);
    }
  }, [hasUploadedToProduction]);

  // Load tax rules when Tax tab is selected
  React.useEffect(() => {
    if (tab === 7) {
      // Tax tab
      loadTaxData();
    }
  }, [tab, loadTaxData]);

  // Handle save to staging - Simplified and robust version
  const handleSave = React.useCallback(async () => {
    if (tab === 2) {
      // Product Types tab - delegate to ProductTypeWorkflow
      if (productTypeWorkflowRef.current) {
        await productTypeWorkflowRef.current.handleSave();
      }
      return;
    }

    if (tab === 3) {
      // Product Categories tab - delegate to ProductCategoryWorkflow
      if (productCategoryWorkflowRef.current) {
        await productCategoryWorkflowRef.current.handleSave();
      }
      return;
    }

    if (tab === 4) {
      // Category tab - delegate to CategoryWorkflow
      if (categoryWorkflowRef.current) {
        await categoryWorkflowRef.current.handleSave();
      }
      return;
    }

    if (tab === 5) {
      // Promotions tab - delegate to PromotionWorkflow
      if (promotionWorkflowRef.current) {
        await promotionWorkflowRef.current.handleSave();
      }
      return;
    }

    if (tab === 6) {
      // Suppliers tab - delegate to SupplierWorkflow
      if (supplierWorkflowRef.current) {
        await supplierWorkflowRef.current.handleSave();
      }
      return;
    }

    if (tab !== 7) {
      // Not tax or supplier tab - no save action
      return;
    }

    // Tax tab logic
    try {
      setIsLoading(true);
      console.warn("Starting save operation with", taxRules.length, "rules");

      // Validate input data - allow empty array for deletion scenario
      if (!Array.isArray(taxRules)) {
        throw new Error("Invalid tax rules data");
      }

      // Handle empty rules case (all rules deleted)
      if (taxRules.length === 0) {
        console.warn("Saving empty tax rules (all rules deleted)");
        // Continue with empty array to clear staging table
      }

      // Enhanced validation for all rules before saving (skip if empty array)
      if (taxRules.length > 0) {
        const validationErrors: string[] = [];
        taxRules.forEach((r, index) => {
          if (!r || typeof r !== "object") {
            validationErrors.push(`Invalid rule at index ${index}`);
            return;
          }

          if (!r.description || r.description.trim() === "") {
            validationErrors.push(
              `Rule at index ${index}: Description is required`
            );
          }

          if (!r.ratePercent || r.ratePercent.toString().trim() === "") {
            validationErrors.push(
              `Rule at index ${index}: Tax rate is required`
            );
          } else {
            const ratePercent = Number.parseFloat(String(r.ratePercent));
            if (isNaN(ratePercent) || ratePercent <= 0) {
              validationErrors.push(
                `Rule at index ${index}: Tax rate must be greater than 0 (got: ${r.ratePercent})`
              );
            }
          }
        });

        if (validationErrors.length > 0) {
          throw new Error(`Validation failed:\n${validationErrors.join("\n")}`);
        }
      }

      // Normalize payload with validation (handle empty array)
      const normalized = taxRules.map((r, index) => {
        if (!r || typeof r !== "object") {
          throw new Error(`Invalid rule at index ${index}`);
        }

        const ratePercent = Number.parseFloat(String(r.ratePercent || 0));
        if (isNaN(ratePercent) || ratePercent <= 0) {
          throw new Error(
            `Invalid rate percentage at index ${String(index)}: ${String(
              r.ratePercent
            )}`
          );
        }

        return {
          description: r.description ?? null,
          ratePercent: ratePercent,
          isInclusive: Boolean(r.isInclusive),
          isGST: Boolean(r.isGST),
        };
      });

      console.warn("Normalized payload:", normalized);

      // Make API call with timeout and error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      console.warn("Making API call to /api/admin/products/tax/staging");
      console.warn("Request payload:", { rules: normalized, deletedRules });

      try {
        const res = await fetchWithAuth("/api/admin/products/tax/staging", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ rules: normalized, deletedRules }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.warn("Response received, status:", res.status, "ok:", res.ok);

        // Handle different response scenarios BEFORE reading body
        if (res.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }

        if (res.status === 403) {
          throw new Error("Access denied. Insufficient permissions.");
        }

        if (res.status === 404) {
          throw new Error(
            "API endpoint not found. Please check the server configuration."
          );
        }

        if (res.status >= 500) {
          throw new Error(
            `Server error (${res.status}). Please try again later.`
          );
        }

        // Only read response body if status indicates success
        if (!res.ok) {
          throw new Error(
            `HTTP error ${res.status}: ${res.statusText || "Unknown error"}`
          );
        }

        // Read response body safely
        let responseText;
        try {
          console.warn("Attempting to read response body...");
          responseText = await res.text();
          console.warn("Response text length:", responseText.length);
          console.warn(
            "Response text preview:",
            responseText.substring(0, 200)
          );
        } catch (textError) {
          console.error("Could not read response body:", textError);
          console.error("Response status:", res.status);
          console.error(
            "Response headers:",
            Object.fromEntries(res.headers.entries())
          );
          throw new Error("Failed to read server response");
        }

        // Handle empty responses
        if (!responseText || !responseText.trim()) {
          throw new Error("Server returned empty response");
        }

        // Parse JSON response
        let json;
        try {
          json = JSON.parse(responseText);
          console.warn("Parsed response:", json);
        } catch (parseError) {
          console.error("Failed to parse response:", parseError);
          console.error("Response text:", responseText.substring(0, 200));
          throw new Error("Server returned invalid JSON response");
        }

        // Validate response structure
        if (!json || typeof json !== "object") {
          throw new Error("Server returned invalid response format");
        }

        if (!json.success) {
          const errorMsg = json.error || json.message || "Unknown server error";
          throw new Error(`Save failed: ${errorMsg}`);
        }

        // Success - update state
        console.warn("Save successful, updating state");
        setOriginalRules([...taxRules]);
        // Keep Save button ENABLED after save (user can make more changes)
        // Disable Save button after successful save to staging
        setIsDirty(false);
        // Always enable upload after successful save (including deletions)
        setHasStagingData(true);
        // Keep deleted rules in localStorage for potential restoration

        const successMessage =
          taxRules.length === 0
            ? "Successfully saved deletions to staging. Click Upload to apply to production."
            : "Successfully saved changes to staging. Click Upload to apply to production.";
        setMessage({ type: "success", text: successMessage });
      } catch (fetchError) {
        clearTimeout(timeoutId);

        if (fetchError instanceof Error) {
          if (fetchError.name === "AbortError") {
            throw new Error("Request timed out. Please try again.");
          }

          if (
            fetchError.name === "TypeError" &&
            fetchError.message.includes("fetch")
          ) {
            throw new Error("Network error. Please check your connection.");
          }
        }

        throw fetchError;
      }
    } catch (e) {
      console.error("Failed to save staging tax rules:", e);
      setMessage({
        type: "error",
        text: `Failed to save to staging: ${
          e instanceof Error ? e.message : "Unknown error"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [tab, taxRules, deletedRules]);

  // Handle upload to production
  const handleUpload = React.useCallback(async () => {
    if (tab === 2) {
      // Product Types tab - delegate to ProductTypeWorkflow
      if (productTypeWorkflowRef.current) {
        await productTypeWorkflowRef.current.handleUpload();
      }
      return;
    }

    if (tab === 3) {
      // Product Categories tab - delegate to ProductCategoryWorkflow
      if (productCategoryWorkflowRef.current) {
        await productCategoryWorkflowRef.current.handleUpload();
      }
      return;
    }

    if (tab === 4) {
      // Category tab - delegate to CategoryWorkflow
      if (categoryWorkflowRef.current) {
        await categoryWorkflowRef.current.handleUpload();
      }
      return;
    }

    if (tab === 5) {
      // Promotions tab - delegate to PromotionWorkflow
      if (promotionWorkflowRef.current) {
        await promotionWorkflowRef.current.handleUpload();
      }
      return;
    }

    if (tab === 6) {
      // Suppliers tab - delegate to SupplierWorkflow
      if (supplierWorkflowRef.current) {
        await supplierWorkflowRef.current.handleUpload();
      }
      return;
    }

    if (tab !== 7) {
      // Not tax or supplier tab - no upload action
      return;
    }

    // Tax tab logic
    try {
      setIsLoading(true);
      const res = await fetchWithAuth("/api/admin/products/tax/publish", {
        method: "POST",
      });

      // Read response body once and handle both success and error cases
      let responseText;
      try {
        responseText = await res.text();
      } catch (textError) {
        console.error("Could not read response body:", textError);
        throw new Error(
          `Failed to read response body: ${
            textError instanceof Error ? textError.message : "Unknown error"
          }`
        );
      }

      // Check if response is valid
      if (!res.ok) {
        const errorText = responseText.trim() || `HTTP ${res.status}`;
        throw new Error(`Publish failed (${res.status}): ${errorText}`);
      }

      // Check if response is empty
      if (!responseText.trim()) {
        throw new Error("Empty response from publish API");
      }

      // Parse JSON response
      let json;
      try {
        json = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse publish response:", parseError);
        throw new Error("Invalid JSON response from publish API");
      }

      if (!json.success) {
        throw new Error(json.error || "Publish operation failed");
      }

      // Successfully published to production
      setHasStagingData(false);
      setIsDirty(false); // ✅ NOW disable Save button (after upload to production)
      setHasUploadedToProduction(true); // Mark that we've uploaded to production

      // Permanently clear deleted rules - they are now gone forever
      setDeletedRules([]);

      // Force clear localStorage completely - no more deleted rules
      if (typeof window !== "undefined") {
        localStorage.removeItem("taxDeletedRules");
        // Double safety: also clear any other potential storage
        localStorage.removeItem("taxDeletedRules_backup");
      }

      // Reload data from production to get the latest state
      await loadTaxData();

      // Final safety check: ensure localStorage is empty after reload
      if (typeof window !== "undefined") {
        localStorage.removeItem("taxDeletedRules");
      }

      setMessage({
        type: "success",
        text: "Successfully published to production. All changes including deletions are now permanent.",
      });
    } catch (e) {
      console.error("Failed to publish to production:", e);
      setMessage({
        type: "error",
        text: `Failed to publish to production: ${
          e instanceof Error ? e.message : "Unknown error"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [tab, loadTaxData]);

  // Handle refresh
  const handleRefresh = React.useCallback(() => {
    if (tab === 2) {
      // Product Types tab - delegate to ProductTypeWorkflow
      if (productTypeWorkflowRef.current) {
        productTypeWorkflowRef.current.handleRefresh();
      }
      return;
    }

    if (tab === 3) {
      // Product Categories tab - delegate to ProductCategoryWorkflow
      if (productCategoryWorkflowRef.current) {
        productCategoryWorkflowRef.current.handleRefresh();
      }
      return;
    }

    if (tab === 4) {
      // Category tab - delegate to CategoryWorkflow
      if (categoryWorkflowRef.current) {
        categoryWorkflowRef.current.handleRefresh();
      }
      return;
    }

    if (tab === 5) {
      // Promotions tab - delegate to PromotionWorkflow
      if (promotionWorkflowRef.current) {
        promotionWorkflowRef.current.handleRefresh();
      }
      return;
    }

    if (tab === 6) {
      // Suppliers tab - delegate to SupplierWorkflow
      if (supplierWorkflowRef.current) {
        supplierWorkflowRef.current.handleRefresh();
      }
      return;
    }

    if (tab === 7) {
      // Tax tab
      // Clear deleted rules state
      setDeletedRules([]);
      setHasUploadedToProduction(false); // Reset flag on manual refresh

      // Force clear localStorage completely on refresh
      if (typeof window !== "undefined") {
        localStorage.removeItem("taxDeletedRules");
        localStorage.removeItem("taxDeletedRules_backup");
        // Clear any other potential variations
        Object.keys(localStorage).forEach((key) => {
          if (key.includes("taxDeletedRules") || key.includes("deletedRules")) {
            localStorage.removeItem(key);
          }
        });
      }

      loadTaxData();
    }
    // TODO: Implement refresh for other tabs
  }, [tab, loadTaxData]);

  // Supplier handlers (delegate to SupplierWorkflow component)
  const handleSupplierSave = React.useCallback(async () => {
    if (supplierWorkflowRef.current) {
      await supplierWorkflowRef.current.handleSave();
    }
  }, []);

  const handleSupplierUpload = React.useCallback(async () => {
    if (supplierWorkflowRef.current) {
      await supplierWorkflowRef.current.handleUpload();
    }
  }, []);

  const handleSupplierRefresh = React.useCallback(() => {
    if (supplierWorkflowRef.current) {
      supplierWorkflowRef.current.handleRefresh();
    }
  }, []);

  // Promotion handlers (delegate to PromotionWorkflow component)
  const handlePromotionSave = React.useCallback(async () => {
    if (promotionWorkflowRef.current) {
      await promotionWorkflowRef.current.handleSave();
    }
  }, []);

  const handlePromotionUpload = React.useCallback(async () => {
    if (promotionWorkflowRef.current) {
      await promotionWorkflowRef.current.handleUpload();
    }
  }, []);

  const handlePromotionRefresh = React.useCallback(() => {
    if (promotionWorkflowRef.current) {
      promotionWorkflowRef.current.handleRefresh();
    }
  }, []);

  // Category handlers (delegate to CategoryWorkflow component)
  const handleCategorySave = React.useCallback(async () => {
    if (categoryWorkflowRef.current) {
      await categoryWorkflowRef.current.handleSave();
    }
  }, []);

  const handleCategoryUpload = React.useCallback(async () => {
    if (categoryWorkflowRef.current) {
      await categoryWorkflowRef.current.handleUpload();
    }
  }, []);

  const handleCategoryRefresh = React.useCallback(() => {
    if (categoryWorkflowRef.current) {
      categoryWorkflowRef.current.handleRefresh();
    }
  }, []);

  // Product Category handlers (delegate to ProductCategoryWorkflow component)
  const handleProductCategorySave = React.useCallback(async () => {
    if (productCategoryWorkflowRef.current) {
      await productCategoryWorkflowRef.current.handleSave();
    }
  }, []);

  const handleProductCategoryUpload = React.useCallback(async () => {
    if (productCategoryWorkflowRef.current) {
      await productCategoryWorkflowRef.current.handleUpload();
    }
  }, []);

  const handleProductCategoryRefresh = React.useCallback(() => {
    if (productCategoryWorkflowRef.current) {
      productCategoryWorkflowRef.current.handleRefresh();
    }
  }, []);

  // Product Type handlers (delegate to ProductTypeWorkflow component)
  const handleProductTypeSave = React.useCallback(async () => {
    if (productTypeWorkflowRef.current) {
      await productTypeWorkflowRef.current.handleSave();
    }
  }, []);

  const handleProductTypeUpload = React.useCallback(async () => {
    if (productTypeWorkflowRef.current) {
      await productTypeWorkflowRef.current.handleUpload();
    }
  }, []);

  const handleProductTypeRefresh = React.useCallback(() => {
    if (productTypeWorkflowRef.current) {
      productTypeWorkflowRef.current.handleRefresh();
    }
  }, []);

  // Product handlers (delegate to ProductWorkflow component)
  const handleProductSave = React.useCallback(async () => {
    if (productWorkflowRef.current) {
      await productWorkflowRef.current.handleSave();
    }
  }, []);

  const handleProductUpload = React.useCallback(async () => {
    if (productWorkflowRef.current) {
      await productWorkflowRef.current.handleUpload();
    }
  }, []);

  const handleProductRefresh = React.useCallback(() => {
    if (productWorkflowRef.current) {
      productWorkflowRef.current.handleRefresh();
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          linear-gradient(135deg, 
            rgba(99, 102, 241, 0.05) 0%, 
            rgba(168, 85, 247, 0.03) 25%, 
            rgba(236, 72, 153, 0.02) 50%, 
            rgba(59, 130, 246, 0.03) 75%, 
            rgba(16, 185, 129, 0.05) 100%
          ),
          linear-gradient(45deg, 
            rgba(255, 255, 255, 0.9) 0%, 
            rgba(248, 250, 252, 0.95) 100%
          )
        `,
        backdropFilter: "blur(10px)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(236, 72, 153, 0.04) 0%, transparent 50%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      <PageLayout
        title="Products Management"
        description="Manage products, categories, variants, inventory, suppliers and tax settings."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products" },
        ]}
        maxWidth="xl"
      >
        <MainContainerBox
          title="Configuration"
          showSave={
            tab === 1 ||
            tab === 2 ||
            tab === 3 ||
            tab === 4 ||
            tab === 5 ||
            tab === 6 ||
            tab === 7
          }
          showUpload={
            tab === 1 ||
            tab === 2 ||
            tab === 3 ||
            tab === 4 ||
            tab === 5 ||
            tab === 6 ||
            tab === 7
          }
          showRefresh={
            tab === 1 ||
            tab === 2 ||
            tab === 3 ||
            tab === 4 ||
            tab === 5 ||
            tab === 6 ||
            tab === 7
          }
          saveDisabled={
            tab === 1
              ? productSaveDisabled
              : tab === 2
              ? productTypeSaveDisabled
              : tab === 3
              ? productCategorySaveDisabled
              : tab === 4
              ? categorySaveDisabled
              : tab === 5
              ? promotionSaveDisabled
              : tab === 6
              ? supplierSaveDisabled
              : tab === 7
              ? !isDirty || isLoading
              : true
          }
          uploadDisabled={
            tab === 1
              ? productUploadDisabled
              : tab === 2
              ? productTypeUploadDisabled
              : tab === 3
              ? productCategoryUploadDisabled
              : tab === 4
              ? categoryUploadDisabled
              : tab === 5
              ? promotionUploadDisabled
              : tab === 6
              ? supplierUploadDisabled
              : tab === 7
              ? !hasStagingData || isLoading
              : true
          }
          onSave={
            tab === 1
              ? handleProductSave
              : tab === 2
              ? handleProductTypeSave
              : tab === 3
              ? handleProductCategorySave
              : tab === 4
              ? handleCategorySave
              : tab === 5
              ? handlePromotionSave
              : tab === 6
              ? handleSupplierSave
              : tab === 7
              ? handleSave
              : () => {}
          }
          onUpload={
            tab === 1
              ? handleProductUpload
              : tab === 2
              ? handleProductTypeUpload
              : tab === 3
              ? handleProductCategoryUpload
              : tab === 4
              ? handleCategoryUpload
              : tab === 5
              ? handlePromotionUpload
              : tab === 6
              ? handleSupplierUpload
              : tab === 7
              ? handleUpload
              : () => {}
          }
          onRefresh={
            tab === 1
              ? handleProductRefresh
              : tab === 2
              ? handleProductTypeRefresh
              : tab === 3
              ? handleProductCategoryRefresh
              : tab === 4
              ? handleCategoryRefresh
              : tab === 5
              ? handlePromotionRefresh
              : tab === 6
              ? handleSupplierRefresh
              : tab === 7
              ? handleRefresh
              : () => {}
          }
        >
          {/* Status Message Banners */}
          {/* Tab 2: Product Types */}
          {tab === 2 && productTypeMessage && (
            <Box
              sx={{
                width: "100%",
                py: 2,
                px: 1,
                mb: 2,
                backgroundColor:
                  productTypeMessage.type === "error"
                    ? "#ffebee"
                    : productTypeMessage.type === "success"
                    ? "#e8f5e8"
                    : "#f5f5f8",
                color:
                  productTypeMessage.type === "error"
                    ? "#c62828"
                    : productTypeMessage.type === "success"
                    ? "#2e7d32"
                    : "#666666",
                fontSize: "14px",
                fontWeight: 500,
                textAlign: "center",
                borderRadius: 0,
                borderLeft: `4px solid ${
                  productTypeMessage.type === "error"
                    ? "#c62828"
                    : productTypeMessage.type === "success"
                    ? "#2e7d32"
                    : "#666666"
                }`,
              }}
            >
              {productTypeMessage.type === "error"
                ? productTypeMessage.text
                : productTypeMessage.type === "success"
                ? productTypeMessage.text.includes("staging")
                  ? "Record saved in staging"
                  : productTypeMessage.text.includes("production")
                  ? "Record saved in production and go live"
                  : "Record saved in staging"
                : "Record saved in staging"}
            </Box>
          )}
          {/* Tab 1: Products */}
          {tab === 1 && productMessage && (
            <Box
              sx={{
                width: "100%",
                py: 2,
                px: 1,
                mb: 2,
                backgroundColor:
                  productMessage.type === "error"
                    ? "#ffebee"
                    : productMessage.type === "success"
                    ? "#e8f5e8"
                    : "#f5f5f5",
                color:
                  productMessage.type === "error"
                    ? "#c62828"
                    : productMessage.type === "success"
                    ? "#2e7d32"
                    : "#666666",
                fontSize: "14px",
                fontWeight: 500,
                textAlign: "center",
                borderRadius: 0,
                borderLeft: `4px solid ${
                  productMessage.type === "error"
                    ? "#c62828"
                    : productMessage.type === "success"
                    ? "#2e7d32"
                    : "#666666"
                }`,
              }}
            >
              {productMessage.type === "error"
                ? productMessage.text
                : productMessage.type === "success"
                ? productMessage.text.includes("staging")
                  ? "Record saved in staging"
                  : productMessage.text.includes("production")
                  ? "Record saved in production and go live"
                  : "Record saved in staging"
                : "Record saved in staging"}
            </Box>
          )}
          {/* Tab 3: Product Categories */}
          {tab === 3 && productCategoryMessage && (
            <Box
              sx={{
                width: "100%",
                py: 2,
                px: 1,
                mb: 2,
                backgroundColor:
                  productCategoryMessage.type === "error"
                    ? "#ffebee"
                    : productCategoryMessage.type === "success"
                    ? "#e8f5e8"
                    : "#f5f5f5",
                color:
                  productCategoryMessage.type === "error"
                    ? "#c62828"
                    : productCategoryMessage.type === "success"
                    ? "#2e7d32"
                    : "#666666",
                fontSize: "14px",
                fontWeight: 500,
                textAlign: "center",
                borderRadius: 0,
                borderLeft: `4px solid ${
                  productCategoryMessage.type === "error"
                    ? "#c62828"
                    : productCategoryMessage.type === "success"
                    ? "#2e7d32"
                    : "#666666"
                }`,
              }}
            >
              {productCategoryMessage.type === "error"
                ? productCategoryMessage.text
                : productCategoryMessage.type === "success"
                ? productCategoryMessage.text.includes("staging")
                  ? "Record saved in staging"
                  : productCategoryMessage.text.includes("production")
                  ? "Record saved in production and go live"
                  : "Record saved in staging"
                : "Record saved in staging"}
            </Box>
          )}
          {/* Tab 4: Categories */}
          {tab === 4 && categoryMessage && (
            <Box
              sx={{
                width: "100%",
                py: 2,
                px: 1,
                mb: 2,
                backgroundColor:
                  categoryMessage.type === "error"
                    ? "#ffebee"
                    : categoryMessage.type === "success"
                    ? "#e8f5e8"
                    : "#f5f5f5",
                color:
                  categoryMessage.type === "error"
                    ? "#c62828"
                    : categoryMessage.type === "success"
                    ? "#2e7d32"
                    : "#666666",
                fontSize: "14px",
                fontWeight: 500,
                textAlign: "center",
                borderRadius: 0,
                borderLeft: `4px solid ${
                  categoryMessage.type === "error"
                    ? "#c62828"
                    : categoryMessage.type === "success"
                    ? "#2e7d32"
                    : "#666666"
                }`,
              }}
            >
              {categoryMessage.type === "error"
                ? categoryMessage.text
                : categoryMessage.type === "success"
                ? categoryMessage.text.includes("staging")
                  ? "Record saved in staging"
                  : categoryMessage.text.includes("production")
                  ? "Record saved in production and go live"
                  : "Record saved in staging"
                : "Record saved in staging"}
            </Box>
          )}
          {/* Tab 5: Promotions */}
          {tab === 5 && promotionMessage && (
            <Box
              sx={{
                width: "100%",
                py: 2,
                px: 1,
                mb: 2,
                backgroundColor:
                  promotionMessage.type === "error"
                    ? "#ffebee"
                    : promotionMessage.type === "success"
                    ? "#e8f5e8"
                    : "#f5f5f5",
                color:
                  promotionMessage.type === "error"
                    ? "#c62828"
                    : promotionMessage.type === "success"
                    ? "#2e7d32"
                    : "#666666",
                fontSize: "14px",
                fontWeight: 500,
                textAlign: "center",
                borderRadius: 0,
                borderLeft: `4px solid ${
                  promotionMessage.type === "error"
                    ? "#c62828"
                    : promotionMessage.type === "success"
                    ? "#2e7d32"
                    : "#666666"
                }`,
              }}
            >
              {promotionMessage.type === "error"
                ? promotionMessage.text
                : promotionMessage.type === "success"
                ? promotionMessage.text.includes("staging")
                  ? "Record saved in staging"
                  : promotionMessage.text.includes("production")
                  ? "Record saved in production and go live"
                  : "Record saved in staging"
                : "Record saved in staging"}
            </Box>
          )}
          {/* Tab 6: Suppliers */}
          {tab === 6 && supplierMessage && (
            <Box
              sx={{
                width: "100%",
                py: 2,
                px: 1,
                mb: 2,
                backgroundColor:
                  supplierMessage.type === "error"
                    ? "#ffebee"
                    : supplierMessage.type === "success"
                    ? "#e8f5e8"
                    : "#f5f5f5",
                color:
                  supplierMessage.type === "error"
                    ? "#c62828"
                    : supplierMessage.type === "success"
                    ? "#2e7d32"
                    : "#666666",
                fontSize: "14px",
                fontWeight: 500,
                textAlign: "center",
                borderRadius: 0,
                borderLeft: `4px solid ${
                  supplierMessage.type === "error"
                    ? "#c62828"
                    : supplierMessage.type === "success"
                    ? "#2e7d32"
                    : "#666666"
                }`,
              }}
            >
              {supplierMessage.type === "error"
                ? supplierMessage.text
                : supplierMessage.type === "success"
                ? supplierMessage.text.includes("staging")
                  ? "Record saved in staging"
                  : supplierMessage.text.includes("production")
                  ? "Record saved in production and go live"
                  : "Record saved in staging"
                : "Record saved in staging"}
            </Box>
          )}
          {/* Tab 7: Tax */}
          {tab === 7 && message && (
            <Box
              sx={{
                width: "100%",
                py: 2,
                px: 1,
                mb: 2,
                backgroundColor:
                  message.type === "error"
                    ? "#ffebee"
                    : message.type === "success"
                    ? "#e8f5e8"
                    : "#f5f5f5",
                color:
                  message.type === "error"
                    ? "#c62828"
                    : message.type === "success"
                    ? "#2e7d32"
                    : "#666666",
                fontSize: "14px",
                fontWeight: 500,
                textAlign: "center",
                borderRadius: 0,
                borderLeft: `4px solid ${
                  message.type === "error"
                    ? "#c62828"
                    : message.type === "success"
                    ? "#2e7d32"
                    : "#666666"
                }`,
              }}
            >
              {message.type === "error"
                ? message.text
                : message.type === "success"
                ? message.text.includes("staging")
                  ? "Record saved in staging"
                  : message.text.includes("production")
                  ? "Record saved in production and go live"
                  : "Record saved in staging"
                : "Record saved in staging"}
            </Box>
          )}
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: (t) =>
                `0 8px 32px ${alpha(t.palette.common.black, 0.12)}`,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: "text.secondary",
                  "&.Mui-selected": { color: "primary.main" },
                  "&:hover": {
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                  },
                },
              }}
            >
              <Tab
                icon={<InventoryIcon />}
                iconPosition="start"
                label="Variants"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
              <Tab
                icon={<Inventory2Icon />}
                iconPosition="start"
                label="Products"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
              <Tab
                icon={<CategoryIcon />}
                iconPosition="start"
                label="Product Types"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
              <Tab
                icon={<CategoryIcon />}
                iconPosition="start"
                label="Product Categories"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
              <Tab
                icon={<CategoryIcon />}
                iconPosition="start"
                label="Categories"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
              <Tab
                icon={<ReceiptLongIcon />}
                iconPosition="start"
                label="Promotions"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
              <Tab
                icon={<LocalShippingIcon />}
                iconPosition="start"
                label="Suppliers"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
              <Tab
                icon={<ReceiptLongIcon />}
                iconPosition="start"
                label="Tax"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
            </Tabs>

            {/* Tab content based on selected tab */}
            {tab === 0 ? (
              // Variants tab
              <Box sx={{ p: 1, pt: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Variants management will be implemented here.
                </Typography>
              </Box>
            ) : tab === 1 ? (
              // Products tab
              <Box sx={{ p: 1, pt: 0.5 }}>
                <ProductWorkflow
                  ref={productWorkflowRef}
                  onSaveDisabledChange={setProductSaveDisabled}
                  onUploadDisabledChange={setProductUploadDisabled}
                  onMessageChange={setProductMessage}
                />
              </Box>
            ) : tab === 2 ? (
              // Product Types tab
              <Box sx={{ p: 1, pt: 0.5 }}>
                <ProductTypeWorkflow
                  ref={productTypeWorkflowRef}
                  onSaveDisabledChange={setProductTypeSaveDisabled}
                  onUploadDisabledChange={setProductTypeUploadDisabled}
                  onMessageChange={setProductTypeMessage}
                />
              </Box>
            ) : tab === 3 ? (
              // Product Categories tab
              <Box sx={{ p: 1, pt: 0.5 }}>
                <ProductCategoryWorkflow
                  ref={productCategoryWorkflowRef}
                  onSaveDisabledChange={setProductCategorySaveDisabled}
                  onUploadDisabledChange={setProductCategoryUploadDisabled}
                  onMessageChange={setProductCategoryMessageCallback}
                />
              </Box>
            ) : tab === 4 ? (
              // Category tab
              <Box sx={{ p: 1, pt: 0.5 }}>
                <CategoryWorkflow
                  ref={categoryWorkflowRef}
                  onSaveDisabledChange={setCategorySaveDisabled}
                  onUploadDisabledChange={setCategoryUploadDisabled}
                  onMessageChange={setCategoryMessageCallback}
                />
              </Box>
            ) : tab === 5 ? (
              // Promotions tab
              <Box sx={{ p: 1, pt: 0.5 }}>
                <PromotionWorkflow
                  ref={promotionWorkflowRef}
                  onSaveDisabledChange={setPromotionSaveDisabled}
                  onUploadDisabledChange={setPromotionUploadDisabled}
                  onMessageChange={setPromotionMessageCallback}
                />
              </Box>
            ) : tab === 6 ? (
              // Suppliers tab
              <Box sx={{ p: 1, pt: 0.5 }}>
                <SupplierWorkflow
                  ref={supplierWorkflowRef}
                  onSaveDisabledChange={setSupplierSaveDisabled}
                  onUploadDisabledChange={setSupplierUploadDisabled}
                  onMessageChange={setSupplierMessageCallback}
                />
              </Box>
            ) : tab === 7 ? (
              // Tax tab
              <Box sx={{ p: 1, pt: 0.5 }}>
                <TaxSettings
                  rules={taxRules}
                  onAdd={handleAddTax}
                  onEdit={handleEditTax}
                  onRemove={handleRemoveTax}
                />

                {/* Staging Changes Section - Show deleted records */}
                {deletedRules.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: "warning.main",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      🗑️ Staging Changes - Deleted Records
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      These records are marked for deletion. You can restore it
                      before uploading to production.
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      {deletedRules.map((deletedRule) => (
                        <Box
                          key={deletedRule.id}
                          sx={{
                            width: "280px",
                            p: 2,
                            borderRadius: 1.5,
                            border: "2px dashed",
                            borderColor: "warning.main",
                            background:
                              "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)",
                            position: "relative",
                          }}
                        >
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {deletedRule.description || "No description"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Rate: {deletedRule.ratePercent}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {deletedRule.isInclusive
                                ? "Inclusive"
                                : "Exclusive"}{" "}
                              | {deletedRule.isGST ? "GST" : "Regular"}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            color="warning"
                            size="small"
                            onClick={() => handleRestoreRule(deletedRule)}
                            sx={{ width: "100%" }}
                          >
                            🔄 Restore Rule
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              // Other tabs placeholder
              <Box sx={{ p: 1, pt: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {
                    "This section is intentionally blank. We'll re-do these tabs next."
                  }
                </Typography>
              </Box>
            )}
          </Card>
        </MainContainerBox>

        {/* Edit Tax Rule Modal */}
        <Dialog
          open={isEditModalOpen}
          onClose={handleCancelEdit}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              color: "primary.main",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            ✏️ Edit Tax Rule
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                fullWidth
                label="Description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="e.g., GST, Provincial Tax"
                size="small"
              />
              <TextField
                fullWidth
                label="Rate %"
                type="number"
                value={editForm.ratePercent}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    ratePercent: e.target.value,
                  }))
                }
                inputProps={{ min: 0, step: 0.01 }}
                required
                size="small"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.isInclusive}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        isInclusive: e.target.checked,
                      }))
                    }
                  />
                }
                label="Tax Inclusive"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.isGST}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        isGST: e.target.checked,
                      }))
                    }
                  />
                }
                label="GST"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCancelEdit}
              variant="outlined"
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              sx={{ minWidth: 100 }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog
          open={isDeleteModalOpen}
          onClose={handleCancelDelete}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              color: "error.main",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            🗑️ Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete this tax rule?
            </Typography>
            {deletingRule && (
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {deletingRule.description || "No description"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rate: {deletingRule.ratePercent}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {deletingRule.isInclusive ? "Inclusive" : "Exclusive"} |{" "}
                  {deletingRule.isGST ? "GST" : "Regular"}
                </Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This action will mark the tax rule for deletion. You can restore
              it before uploading to production.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCancelDelete}
              variant="outlined"
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              sx={{ minWidth: 100 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </PageLayout>
    </Box>
  );
}
