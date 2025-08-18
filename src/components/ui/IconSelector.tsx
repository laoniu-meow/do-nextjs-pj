"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  iconLibrary,
  IconOption,
  searchIcons,
  getIconCategories,
} from "./config/iconLibrary";

interface IconSelectorProps {
  selectedIconId?: string;
  onIconSelect: (icon: IconOption) => void;
  label?: string;
  placeholder?: string;
  showCategories?: boolean;
  maxHeight?: string;
  className?: string;
}

export function IconSelector({
  selectedIconId,
  onIconSelect,
  label = "Select Icon",
  placeholder = "Search icons...",
  showCategories = true,
  maxHeight = "400px",
  className,
}: IconSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter icons based on search query and category
  const filteredIcons = useMemo(() => {
    let icons = iconLibrary;

    if (searchQuery.trim()) {
      icons = searchIcons(searchQuery.trim());
    }

    if (selectedCategory !== "all") {
      icons = icons.filter((icon) => icon.category === selectedCategory);
    }

    return icons;
  }, [searchQuery, selectedCategory]);

  const categories = useMemo(() => getIconCategories(), []);

  const handleIconClick = (icon: IconOption) => {
    onIconSelect(icon);
  };

  const getSelectedIcon = () => {
    return selectedIconId
      ? iconLibrary.find((icon) => icon.id === selectedIconId)
      : null;
  };

  return (
    <Box className={className}>
      {/* Search and Category Selection */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          label={label}
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: showCategories ? 2 : 0 }}
        />

        {showCategories && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Chip
              label="All"
              onClick={() => setSelectedCategory("all")}
              color={selectedCategory === "all" ? "primary" : "default"}
              variant={selectedCategory === "all" ? "filled" : "outlined"}
              size="small"
            />
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? "primary" : "default"}
                variant={selectedCategory === category ? "filled" : "outlined"}
                size="small"
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Selected Icon Display */}
      {getSelectedIcon() &&
        (() => {
          const SelIcon = getSelectedIcon()!.icon;
          const selected = getSelectedIcon()!;
          return (
            <Box
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selected Icon:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <SelIcon sx={{ fontSize: 24 }} />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {selected.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selected.category}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })()}

      {/* Icon Grid */}
      <Box sx={{ maxHeight, overflow: "auto" }}>
        {filteredIcons.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              No icons found matching your search.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {filteredIcons.map((icon) => (
              <Card
                key={icon.id}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border:
                    selectedIconId === icon.id ? "2px solid" : "1px solid",
                  borderColor:
                    selectedIconId === icon.id ? "primary.main" : "divider",
                  backgroundColor:
                    selectedIconId === icon.id
                      ? "primary.50"
                      : "background.paper",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 2,
                    borderColor: "primary.main",
                  },
                }}
                onClick={() => handleIconClick(icon)}
              >
                <CardContent sx={{ p: 2, textAlign: "center" }}>
                  {(() => {
                    const Icon = icon.icon;
                    return (
                      <Icon
                        sx={{ fontSize: 32, mb: 1, color: "text.primary" }}
                      />
                    );
                  })()}
                  <Typography variant="caption" component="div" noWrap>
                    {icon.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    component="div"
                    noWrap
                  >
                    {icon.category}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Results Count */}
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Typography variant="caption" color="text.secondary">
          {filteredIcons.length} icon{filteredIcons.length !== 1 ? "s" : ""}{" "}
          found
        </Typography>
      </Box>
    </Box>
  );
}

export default IconSelector;
