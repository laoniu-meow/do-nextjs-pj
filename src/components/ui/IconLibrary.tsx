"use client";

import React, { useState } from "react";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  LocalHospital as HealthIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Celebration as CelebrationIcon,
  Security as SecurityIcon,
  Public as PublicIcon,
  Handshake as HandshakeIcon,
  Psychology as PsychologyIcon,
  Accessibility as AccessibilityIcon,
  Pets as PetsIcon,
  LocalLibrary as LocalLibrary,
  HealthAndSafety as HealthAndSafety,
  Emergency as Emergency,
  LocalShipping as LocalShipping,
  Construction as Construction,
  Science as Science,
  Sports as Sports,
  MusicNote as MusicNote,
  TheaterComedy as TheaterComedy,
  Restaurant as Restaurant,
  LocalPharmacy as LocalPharmacy,
  LocalPolice as LocalPolice,
  FireTruck as FireTruck,
  DirectionsBus as DirectionsBus,
  Train as Train,
  Flight as Flight,
  DirectionsBoat as DirectionsBoat,
  DirectionsCar as DirectionsCar,
  DirectionsWalk as DirectionsWalk,
  DirectionsBike as DirectionsBike,
  DirectionsSubway as DirectionsSubway,
} from "@mui/icons-material";

interface IconLibraryProps {
  onIconSelect?: (iconName: string) => void;
  selectedIcon?: string;
  onClose?: () => void;
}

interface IconData {
  name: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  tags: string[];
}

interface CategoryData {
  [key: string]: IconData[];
}

const iconCategories: CategoryData = {
  "NGO & Social": [
    { name: "Favorite", icon: FavoriteIcon, tags: ["love", "heart", "care"] },
    {
      name: "People",
      icon: PeopleIcon,
      tags: ["community", "group", "society"],
    },

    {
      name: "Handshake",
      icon: HandshakeIcon,
      tags: ["partnership", "agreement", "cooperation"],
    },

    {
      name: "Psychology",
      icon: PsychologyIcon,
      tags: ["mental health", "counseling", "support"],
    },
    {
      name: "Accessibility",
      icon: AccessibilityIcon,
      tags: ["accessibility", "inclusion", "disability"],
    },

    { name: "Pets", icon: PetsIcon, tags: ["animals", "pets", "welfare"] },
  ],
  Education: [
    {
      name: "School",
      icon: SchoolIcon,
      tags: ["education", "school", "learning"],
    },
    {
      name: "LocalLibrary",
      icon: LocalLibrary,
      tags: ["library", "books", "knowledge"],
    },
    {
      name: "Science",
      icon: Science,
      tags: ["research", "science", "innovation"],
    },
  ],
  Healthcare: [
    {
      name: "LocalHospital",
      icon: HealthIcon,
      tags: ["health", "hospital", "medical"],
    },
    {
      name: "HealthAndSafety",
      icon: HealthAndSafety,
      tags: ["safety", "health", "protection"],
    },
    {
      name: "Emergency",
      icon: Emergency,
      tags: ["emergency", "urgent", "crisis"],
    },
    {
      name: "LocalPharmacy",
      icon: LocalPharmacy,
      tags: ["medicine", "pharmacy", "health"],
    },
  ],

  Community: [
    { name: "Home", icon: HomeIcon, tags: ["home", "housing", "community"] },
    { name: "Work", icon: WorkIcon, tags: ["employment", "work", "jobs"] },
    {
      name: "Business",
      icon: BusinessIcon,
      tags: ["business", "enterprise", "development"],
    },
    {
      name: "Celebration",
      icon: CelebrationIcon,
      tags: ["celebration", "events", "community"],
    },
    {
      name: "Security",
      icon: SecurityIcon,
      tags: ["security", "safety", "protection"],
    },
    {
      name: "Public",
      icon: PublicIcon,
      tags: ["public", "community", "shared"],
    },
  ],
  Transportation: [
    {
      name: "LocalShipping",
      icon: LocalShipping,
      tags: ["shipping", "logistics", "delivery"],
    },

    {
      name: "DirectionsBus",
      icon: DirectionsBus,
      tags: ["bus", "public transport", "mobility"],
    },
    { name: "Train", icon: Train, tags: ["train", "railway", "transport"] },
    {
      name: "Flight",
      icon: Flight,
      tags: ["flight", "air travel", "transport"],
    },
    {
      name: "DirectionsBoat",
      icon: DirectionsBoat,
      tags: ["boat", "water transport", "maritime"],
    },
    {
      name: "DirectionsCar",
      icon: DirectionsCar,
      tags: ["car", "automobile", "transport"],
    },
    {
      name: "DirectionsWalk",
      icon: DirectionsWalk,
      tags: ["walking", "pedestrian", "mobility"],
    },
    {
      name: "DirectionsBike",
      icon: DirectionsBike,
      tags: ["bicycle", "cycling", "mobility"],
    },
    {
      name: "DirectionsSubway",
      icon: DirectionsSubway,
      tags: ["subway", "metro", "public transport"],
    },
  ],
  Infrastructure: [
    {
      name: "Construction",
      icon: Construction,
      tags: ["construction", "building", "infrastructure"],
    },
    {
      name: "LocalPolice",
      icon: LocalPolice,
      tags: ["police", "law enforcement", "security"],
    },
    {
      name: "FireTruck",
      icon: FireTruck,
      tags: ["fire truck", "emergency", "fire safety"],
    },
  ],
  "Culture & Arts": [
    {
      name: "Sports",
      icon: Sports,
      tags: ["sports", "athletics", "recreation"],
    },
    { name: "MusicNote", icon: MusicNote, tags: ["music", "arts", "culture"] },
    {
      name: "TheaterComedy",
      icon: TheaterComedy,
      tags: ["theater", "arts", "culture"],
    },
    {
      name: "Restaurant",
      icon: Restaurant,
      tags: ["food", "restaurant", "nutrition"],
    },
  ],
};

export function IconLibrary({
  onIconSelect,
  selectedIcon,
  onClose,
}: IconLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleIconClick = (iconName: string) => {
    onIconSelect?.(iconName);
    onClose?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  // Filter icons based on search term and category
  const filteredIcons = Object.entries(iconCategories).flatMap(
    ([category, icons]) => {
      if (selectedCategory !== "all" && selectedCategory !== category) {
        return [];
      }

      return icons.filter(
        (icon) =>
          icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          icon.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
  );

  const categories = Object.keys(iconCategories);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Icon Library</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Icon Grid */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {filteredIcons.map((icon) => {
                const IconComponent = icon.icon;
                return (
                  <button
                    key={icon.name}
                    onClick={() => handleIconClick(icon.name)}
                    className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedIcon === icon.name
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    title={icon.name}
                  >
                    <IconComponent className="w-6 h-6 text-black" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No icons found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
