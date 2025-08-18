import React from "react";
import {
  Menu,
  MenuOpen,
  MenuBook,
  Settings,
  Dashboard,
  Widgets,
  AccountCircle,
  Person,
  Business,
  ViewHeadline,
  ViewQuilt,
  Star,
  Navigation,
  SwitchAccessShortcut,
  Apps,
  Logout,
  Home,
  Search,
  Notifications,
  Favorite,
  Article,
} from "@mui/icons-material";

export interface IconOption {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; [key: string]: unknown }>;
  category: string;
  description: string;
}

export const iconLibrary: IconOption[] = [
  // Menu Icons
  {
    id: "menu",
    name: "Menu",
    icon: Menu,
    category: "Menu & Navigation",
    description: "Standard hamburger menu icon"
  },
  {
    id: "menu-open",
    name: "Menu Open",
    icon: MenuOpen,
    category: "Menu & Navigation",
    description: "Open menu icon"
  },
  {
    id: "menu-book",
    name: "Menu Book",
    icon: MenuBook,
    category: "Menu & Navigation",
    description: "Book-style menu icon"
  },
  
  // Settings Icons
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    category: "Settings & Configuration",
    description: "Standard settings gear icon"
  },
  
  // Dashboard Icons
  {
    id: "dashboard",
    name: "Dashboard",
    icon: Dashboard,
    category: "Dashboard & Widgets",
    description: "Standard dashboard icon"
  },
  {
    id: "widgets",
    name: "Widgets",
    icon: Widgets,
    category: "Dashboard & Widgets",
    description: "Widgets icon"
  },
  
  // User Icons
  {
    id: "account-circle",
    name: "Account Circle",
    icon: AccountCircle,
    category: "User & Account",
    description: "User account circle icon"
  },
  {
    id: "person",
    name: "Person",
    icon: Person,
    category: "User & Account",
    description: "Person icon"
  },
  
  // Business Icons
  {
    id: "business",
    name: "Business",
    icon: Business,
    category: "Business & Company",
    description: "Business building icon"
  },
  
  // Layout Icons
  {
    id: "view-headline",
    name: "View Headline",
    icon: ViewHeadline,
    category: "Layout & Design",
    description: "Headline view icon"
  },
  {
    id: "view-quilt",
    name: "View Quilt",
    icon: ViewQuilt,
    category: "Layout & Design",
    description: "Quilt view icon"
  },
  
  // Content Icons
  {
    id: "pages",
    name: "Pages",
    icon: Article,
    category: "Content & Pages",
    description: "Pages icon"
  },
  
  // Hero Icons
  {
    id: "star",
    name: "Star",
    icon: Star,
    category: "Hero & Features",
    description: "Star icon"
  },
  
  // Navigation Icons
  {
    id: "navigation",
    name: "Navigation",
    icon: Navigation,
    category: "Navigation & Routing",
    description: "Navigation icon"
  },
  
  // Quick Access Icons
  {
    id: "switch-access-shortcut",
    name: "Switch Access Shortcut",
    icon: SwitchAccessShortcut,
    category: "Quick Access",
    description: "Access shortcut icon"
  },
  
  // App Icons
  {
    id: "apps",
    name: "Apps",
    icon: Apps,
    category: "System & Apps",
    description: "Apps icon"
  },
  
  // Logout Icons
  {
    id: "logout",
    name: "Logout",
    icon: Logout,
    category: "Logout & Security",
    description: "Logout icon"
  },
  
  // Utility Icons
  {
    id: "home",
    name: "Home",
    icon: Home,
    category: "Utility",
    description: "Home icon"
  },
  {
    id: "search",
    name: "Search",
    icon: Search,
    category: "Utility",
    description: "Search icon"
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Notifications,
    category: "Utility",
    description: "Notifications icon"
  },
  {
    id: "favorite",
    name: "Favorite",
    icon: Favorite,
    category: "Utility",
    description: "Favorite icon"
  }
];

// Helper function to get icon by ID
export function getIconById(id: string): IconOption | undefined {
  return iconLibrary.find(icon => icon.id === id);
}

// Helper function to get icons by category
export function getIconsByCategory(category: string): IconOption[] {
  return iconLibrary.filter(icon => icon.category === category);
}

// Helper function to search icons by name or description
export function searchIcons(query: string): IconOption[] {
  const lowercaseQuery = query.toLowerCase();
  return iconLibrary.filter(icon => 
    icon.name.toLowerCase().includes(lowercaseQuery) ||
    icon.description.toLowerCase().includes(lowercaseQuery) ||
    icon.category.toLowerCase().includes(lowercaseQuery)
  );
}

// Get all categories
export function getIconCategories(): string[] {
  return [...new Set(iconLibrary.map(icon => icon.category))];
}
