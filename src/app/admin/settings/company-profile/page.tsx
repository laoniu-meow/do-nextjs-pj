"use client";

import React, { useState, useEffect } from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";
import { DynamicSettingsPanel } from "@/components/settings";
import { CompanyFormData } from "@/types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";

export default function CompanyProfilePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [companies, setCompanies] = useState<CompanyFormData[]>([]);
  const [currentFormData, setCurrentFormData] =
    useState<CompanyFormData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCompanyIndex, setEditingCompanyIndex] = useState<number | null>(
    null
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStagingData, setHasStagingData] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadCompanyData();
  }, []);

  // Load company data (staging first, then production)
  const loadCompanyData = async () => {
    setIsLoading(true);
    try {
      // First try to load from staging
      const stagingResponse = await fetch("/api/company-profile/staging");
      if (stagingResponse.ok) {
        const stagingData = await stagingResponse.json();
        if (stagingData.success && stagingData.data.length > 0) {
          // Load staging data and enable Save button (data needs to be saved)
          setCompanies(stagingData.data);
          setHasUnsavedChanges(true);
          setHasStagingData(true);
          setIsLoading(false);
          return;
        }
      }

      // If no staging data, load from production
      const productionResponse = await fetch("/api/company-profile/production");
      if (productionResponse.ok) {
        const productionData = await productionResponse.json();
        if (productionData.success && productionData.data.length > 0) {
          setCompanies(productionData.data);
          setHasUnsavedChanges(false);
          setHasStagingData(false);
        } else {
          // No data in either staging or production
          setCompanies([]);
          setHasUnsavedChanges(false);
          setHasStagingData(false);
        }
      }
    } catch (error) {
      console.error("Error loading company data:", error);
      // On error, assume no data and disable buttons
      setCompanies([]);
      setHasUnsavedChanges(false);
      setHasStagingData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuild = () => {
    setIsEditMode(false);
    setEditingCompanyIndex(null);
    setCurrentFormData(null);
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    // Close without saving - no changes
    setIsSettingsOpen(false);
    setCurrentFormData(null);
    setIsEditMode(false);
    setEditingCompanyIndex(null);
  };

  const handleApplySettings = () => {
    // Get the current form data from the settings panel
    if (currentFormData && currentFormData.name.trim()) {
      if (isEditMode && editingCompanyIndex !== null) {
        // Update existing company
        setCompanies((prev) =>
          prev.map((company, index) =>
            index === editingCompanyIndex ? currentFormData : company
          )
        );
      } else {
        // Create new company
        const newCompany: CompanyFormData = {
          name: currentFormData.name,
          logo: currentFormData.logo || "",
          logoUrl: currentFormData.logoUrl || "",
          companyRegNumber: currentFormData.companyRegNumber || "",
          email: currentFormData.email || "",
          address: currentFormData.address || "",
          country: currentFormData.country || "",
          postalCode: currentFormData.postalCode || "",
          contact: currentFormData.contact || "",
        };
        setCompanies((prev) => [...prev, newCompany]);
      }

      // Mark as having unsaved changes
      setHasUnsavedChanges(true);
      setHasStagingData(false); // Clear staging data state since we have new unsaved changes

      setCurrentFormData(null);
      setIsEditMode(false);
      setEditingCompanyIndex(null);
    }
    setIsSettingsOpen(false);
  };

  // Function to update form data from settings panel
  const handleFormDataChange = (formData: CompanyFormData) => {
    setCurrentFormData(formData);
  };

  // Function to handle edit button click
  const handleEditCompany = (company: CompanyFormData, index: number) => {
    setCurrentFormData(company);
    setIsEditMode(true);
    setEditingCompanyIndex(index);
    setIsSettingsOpen(true);
  };

  // Function to handle remove company
  const handleRemoveCompany = async (index: number) => {
    const companyToRemove = companies[index];

    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to remove "${companyToRemove.name}"? This action cannot be undone.`
    );

    if (!isConfirmed) {
      return; // User cancelled the removal
    }

    setIsLoading(true);
    try {
      // First, try to remove from staging table
      const stagingResponse = await fetch("/api/company-profile/staging", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company: companyToRemove }),
      });

      // Then, try to remove from production table
      const productionResponse = await fetch(
        "/api/company-profile/production",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company: companyToRemove }),
        }
      );

      // Remove from local state
      setCompanies((prev) => prev.filter((_, i) => i !== index));
      setEditingCompanyIndex(null); // Reset editing index if the removed company was being edited
      setIsEditMode(false);

      // Check if we need to update the staging data state
      if (stagingResponse.ok || productionResponse.ok) {
        // If we successfully removed from either table, mark as having unsaved changes
        setHasUnsavedChanges(true);
        setHasStagingData(false);
      }

      console.log("Company removed from database successfully");
    } catch (error) {
      console.error("Error removing company from database:", error);
      // Even if database removal fails, remove from UI to maintain consistency
      setCompanies((prev) => prev.filter((_, i) => i !== index));
      setEditingCompanyIndex(null);
      setIsEditMode(false);
      setHasUnsavedChanges(true);
      setHasStagingData(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle Save button click
  const handleSave = async () => {
    if (companies.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/company-profile/staging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companies }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setHasUnsavedChanges(false);
          setHasStagingData(true);
          alert("Data saved to staging successfully!");
        }
      } else {
        alert("Failed to save data to staging");
      }
    } catch (error) {
      console.error("Error saving to staging:", error);
      alert("Error saving data to staging");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle Upload button click
  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/company-profile/production", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Reload data from production (which will now be empty staging)
          setHasStagingData(false);
          await loadCompanyData();
          alert("Data uploaded to production successfully!");
        }
      } else {
        alert("Failed to upload data to production");
      }
    } catch (error) {
      console.error("Error uploading to production:", error);
      alert("Error uploading data to production");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle Refresh button click
  const handleRefresh = () => {
    // Refresh the current page
    window.location.reload();
  };

  return (
    <PageLayout
      title="Company Profile"
      description="Configure your company profile, branding, and company-specific settings."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Company Profile" },
      ]}
      maxWidth="xl"
    >
      <MainContainerBox
        title="Configuration"
        showBuild={true}
        showSave={true}
        showUpload={true}
        showRefresh={true}
        onBuild={handleBuild}
        onSave={handleSave}
        onUpload={handleUpload}
        onRefresh={handleRefresh}
        saveDisabled={!hasUnsavedChanges || isLoading}
        uploadDisabled={!hasStagingData || isLoading}
      >
        <div className="space-y-6">
          {/* Company profile configuration content */}
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Company Profile Configuration
            </h3>
            <p className="text-gray-500 text-sm">
              Click &ldquo;Build&rdquo; to add company information. Use the
              settings panel to configure your company details.
            </p>
          </div>

          {/* Company Cards - Sub-cards nested inside MainContainerBox */}
          {isLoading && (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}

          {!isLoading && companies.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              {companies.map((company, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    border: "2px solid #e5e7eb",
                    padding: "24px",
                    minHeight: "280px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      color: "white",
                      padding: "12px",
                      borderRadius: "8px",
                      marginTop: "-24px",
                      marginLeft: "-24px",
                      marginRight: "-24px",
                      marginBottom: "20px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        {company.logoUrl && (
                          <Image
                            src={company.logoUrl}
                            alt={`${company.name} logo`}
                            width={32}
                            height={32}
                            style={{
                              borderRadius: "4px",
                              objectFit: "cover",
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                            }}
                          />
                        )}
                        <h4 style={{ fontWeight: "bold", fontSize: "18px" }}>
                          {company.name}
                        </h4>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                        }}
                      >
                        <button
                          onClick={() => handleEditCompany(company, index)}
                          style={{
                            backgroundColor: "#80d9ff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "32px",
                            height: "32px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                          onMouseOver={(e) => {
                            const target = e.target as HTMLButtonElement;
                            target.style.backgroundColor = "#57C785";
                            target.style.transform = "translateY(-2px)";
                            target.style.boxShadow =
                              "0 4px 8px rgba(0, 0, 0, 0.15)";
                          }}
                          onMouseOut={(e) => {
                            const target = e.target as HTMLButtonElement;
                            target.style.backgroundColor = "#80d9ff";
                            target.style.transform = "translateY(0)";
                            target.style.boxShadow =
                              "0 2px 4px rgba(0, 0, 0, 0.1)";
                          }}
                          title="Edit Company"
                        >
                          <EditIcon sx={{ color: "#fce7f3" }} />
                        </button>

                        {index > 0 && (
                          <button
                            onClick={() => handleRemoveCompany(index)}
                            style={{
                              backgroundColor: "#80d9ff",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              padding: "8px",
                              cursor: "pointer",
                              fontSize: "14px",
                              fontWeight: "500",
                              transition: "all 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "32px",
                              height: "32px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                            onMouseOver={(e) => {
                              const target = e.target as HTMLButtonElement;
                              target.style.backgroundColor = "#57C785";
                              target.style.transform = "translateY(-2px)";
                              target.style.boxShadow =
                                "0 4px 8px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseOut={(e) => {
                              const target = e.target as HTMLButtonElement;
                              target.style.backgroundColor = "#80d9ff";
                              target.style.transform = "translateY(0)";
                              target.style.boxShadow =
                                "0 2px 4px rgba(0, 0, 0, 0.1)";
                            }}
                            title="Remove Company"
                          >
                            <DeleteIcon sx={{ color: "#fce7f3" }} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {company.email && (
                      <div
                        style={{
                          borderLeft: "4px solid #bfdbfe",
                          paddingLeft: "12px",
                        }}
                      >
                        <span
                          style={{
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          Email:
                        </span>
                        <p style={{ color: "#1f2937", fontSize: "14px" }}>
                          {company.email}
                        </p>
                      </div>
                    )}

                    {company.contact && (
                      <div
                        style={{
                          borderLeft: "4px solid #bbf7d0",
                          paddingLeft: "12px",
                        }}
                      >
                        <span
                          style={{
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          Contact:
                        </span>
                        <p style={{ color: "#1f2937", fontSize: "14px" }}>
                          {company.contact}
                        </p>
                      </div>
                    )}

                    {company.address && (
                      <div
                        style={{
                          borderLeft: "4px solid #ddd6fe",
                          paddingLeft: "12px",
                        }}
                      >
                        <span
                          style={{
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          Address:
                        </span>
                        <p style={{ color: "#1f2937", fontSize: "14px" }}>
                          {company.address}
                        </p>
                      </div>
                    )}

                    {company.companyRegNumber && (
                      <div
                        style={{
                          borderLeft: "4px solid #fbbf24",
                          paddingLeft: "12px",
                        }}
                      >
                        <span
                          style={{
                            color: "#4b5563",
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          Registration Number:
                        </span>
                        <p style={{ color: "#1f2937", fontSize: "14px" }}>
                          {company.companyRegNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </MainContainerBox>

      <DynamicSettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={handleApplySettings}
        onFormDataChange={handleFormDataChange}
        title={isEditMode ? "Edit Company Profile" : "Add Company Profile"}
        initialData={currentFormData}
      />
    </PageLayout>
  );
}
