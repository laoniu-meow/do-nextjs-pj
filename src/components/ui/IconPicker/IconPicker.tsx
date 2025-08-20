"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Chip,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import { iconLibrary, IconOption } from "./iconLibrary";

interface IconPickerProps {
  open: boolean;
  onClose: () => void;
  onIconSelect: (icon: IconOption) => void;
  selectedIconId?: string;
  title?: string;
  searchPlaceholder?: string;
  maxHeight?: string;
}

export function IconPicker({
  open,
  onClose,
  onIconSelect,
  selectedIconId,
  title = "Select Icon",
  searchPlaceholder = "Search icons by name, description, or category...",
  maxHeight = "70vh",
}: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(iconLibrary.map((icon) => icon.category));
    return Array.from(uniqueCategories);
  }, []);

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    let icons = iconLibrary;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      icons = icons.filter(
        (icon) =>
          icon.name.toLowerCase().includes(query) ||
          icon.description.toLowerCase().includes(query) ||
          icon.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "all") {
      icons = icons.filter((icon) => icon.category === selectedCategory);
    }

    return icons;
  }, [searchQuery, selectedCategory]);

  const handleIconSelect = (icon: IconOption) => {
    onIconSelect(icon);
    onClose();
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "all" : category);
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight,
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          pt: 2,
          px: 3,
        }}
      >
        <Typography variant="h5" component="span" fontWeight="600">
          {title}
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Search Section */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <TextField
            fullWidth
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              ),
            }}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Categories */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Categories
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Chip
              label="All Icons"
              onClick={() => handleCategorySelect("all")}
              color={selectedCategory === "all" ? "primary" : "default"}
              variant={selectedCategory === "all" ? "filled" : "outlined"}
              size="small"
            />
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => handleCategorySelect(category)}
                color={selectedCategory === category ? "primary" : "default"}
                variant={selectedCategory === category ? "filled" : "outlined"}
                size="small"
              />
            ))}
          </Box>
        </Box>

        {/* Icons Grid */}
        <Box sx={{ p: 3, overflowY: "auto" }}>
          {filteredIcons.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                No icons found matching your criteria
              </Typography>
            </Box>
          ) : (
            <>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                Showing {filteredIcons.length} of {iconLibrary.length} icons
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  gap: 2,
                }}
              >
                {filteredIcons.map((icon) => {
                  const IconComponent = icon.icon;
                  const isSelected = selectedIconId === icon.id;

                  return (
                    <Button
                      key={icon.id}
                      onClick={() => handleIconSelect(icon)}
                      variant="outlined"
                      sx={{
                        p: 2,
                        minHeight: 80,
                        flexDirection: "column",
                        gap: 1,
                        borderColor: isSelected ? "primary.main" : "divider",
                        backgroundColor: isSelected
                          ? "primary.50"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: isSelected
                            ? "primary.100"
                            : "action.hover",
                        },
                      }}
                    >
                      <IconComponent
                        sx={{ fontSize: 24, color: "text.primary" }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          textAlign: "center",
                          lineHeight: 1.2,
                          color: "text.secondary",
                        }}
                      >
                        {icon.name}
                      </Typography>
                    </Button>
                  );
                })}
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
