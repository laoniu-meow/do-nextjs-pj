import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
} from "@mui/material";

import { Add, Business, Edit, Delete, Visibility } from "@mui/icons-material";
import { CompanyForm } from "../../components/company";
import { useCompanyManagement } from "../../hooks/useCompanyManagement";
import {
  Company,
  CreateCompanyData,
  UpdateCompanyData,
} from "../../types/company";

export const CompanyManagementPage: React.FC = () => {
  const {
    companies,
    currentCompany,
    isLoading,
    error,
    isFormOpen,
    editingCompany,
    hasCompanies,
    handleCreateCompany,
    handleUpdateCompany,
    handleDeleteCompany,
    openCreateForm,
    openEditForm,
    closeForm,
    selectCompany,
  } = useCompanyManagement();

  const handleSubmit = async (data: CreateCompanyData | UpdateCompanyData) => {
    if ("id" in data) {
      const result = await handleUpdateCompany(data);
      if (result.success) {
        // Success handling
      }
    } else {
      const result = await handleCreateCompany(data);
      if (result.success) {
        // Success handling
      }
    }
  };

  const handleDelete = async (company: Company) => {
    if (window.confirm(`Are you sure you want to delete "${company.name}"?`)) {
      const result = await handleDeleteCompany(company.id);
      if (result.success) {
        // Success handling
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  if (isLoading && !hasCompanies) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Company Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage your company information and settings
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreateForm}
          size="large"
        >
          Add New Company
        </Button>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Companies Grid */}
      {hasCompanies ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {companies.map((company) => (
            <Box key={company.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                  },
                }}
                onClick={() => selectCompany(company)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      src={company.logo}
                      sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        backgroundColor: "primary.main",
                      }}
                    >
                      <Business />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {company.name}
                      </Typography>
                      <Chip
                        label={
                          currentCompany?.id === company.id
                            ? "Active"
                            : "Inactive"
                        }
                        color={
                          currentCompany?.id === company.id
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {company.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    {company.website && (
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        🌐 {company.website}
                      </Typography>
                    )}
                    {company.email && (
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        📧 {company.email}
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(company.createdAt)}
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                >
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectCompany(company);
                    }}
                  >
                    View
                  </Button>
                  <Box>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditForm(company);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(company);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={8}>
          <Business sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No companies yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Get started by creating your first company
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreateForm}
            size="large"
          >
            Create Company
          </Button>
        </Box>
      )}

      {/* Company Form Dialog */}
      <Dialog
        open={isFormOpen}
        onClose={closeForm}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <CompanyForm
          company={editingCompany || undefined}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isLoading={isLoading}
        />
      </Dialog>
    </Container>
  );
};

export default CompanyManagementPage;
