import React from "react";
import {
  Menu, MenuOpen, Settings, Dashboard, Widgets,
  AccountCircle, Person, Business, ViewHeadline,
  ViewQuilt, Star, Navigation, Apps, Logout,
  Home, Search, Notifications, Favorite, Article,
  MenuBook, SwitchAccessShortcut
} from "@mui/icons-material";

export interface IconOption {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; [key: string]: unknown }>;
  category: string;
  description: string;
}

export const iconLibrary: IconOption[] = [
  // Menu & Navigation
  { id: "menu", name: "Menu", icon: Menu, category: "Menu & Navigation", description: "Standard hamburger menu icon" },
  { id: "menu-open", name: "Menu Open", icon: MenuOpen, category: "Menu & Navigation", description: "Open menu icon" },
  { id: "menu-book", name: "Menu Book", icon: MenuBook, category: "Menu & Navigation", description: "Book-style menu icon" },
  
  // Settings & Configuration
  { id: "settings", name: "Settings", icon: Settings, category: "Settings & Configuration", description: "Standard settings gear icon" },
  
  // Dashboard & Widgets
  { id: "dashboard", name: "Dashboard", icon: Dashboard, category: "Dashboard & Widgets", description: "Standard dashboard icon" },
  { id: "widgets", name: "Widgets", icon: Widgets, category: "Dashboard & Widgets", description: "Widgets icon" },
  
  // User & Account
  { id: "account-circle", name: "Account Circle", icon: AccountCircle, category: "User & Account", description: "User account circle icon" },
  { id: "person", name: "Person", icon: Person, category: "User & Account", description: "Person icon" },
  
  // Business & Company
  { id: "business", name: "Business", icon: Business, category: "Business & Company", description: "Business building icon" },
  
  // Layout & Design
  { id: "view-headline", name: "View Headline", icon: ViewHeadline, category: "Layout & Design", description: "Headline view icon" },
  { id: "view-quilt", name: "View Quilt", icon: ViewQuilt, category: "Layout & Design", description: "Quilt view icon" },
  
  // Content & Pages
  { id: "pages", name: "Pages", icon: Article, category: "Content & Pages", description: "Pages icon" },
  
  // Hero & Features
  { id: "star", name: "Star", icon: Star, category: "Hero & Features", description: "Star icon" },
  
  // Navigation & Routing
  { id: "navigation", name: "Navigation", icon: Navigation, category: "Navigation & Routing", description: "Navigation icon" },
  
  // Quick Access
  { id: "switch-access-shortcut", name: "Switch Access Shortcut", icon: SwitchAccessShortcut, category: "Quick Access", description: "Access shortcut icon" },
  
  // System & Apps
  { id: "apps", name: "Apps", icon: Apps, category: "System & Apps", description: "Apps icon" },
  
  // Logout & Security
  { id: "logout", name: "Logout", icon: Logout, category: "Logout & Security", description: "Logout icon" },
  
  // Utility
  { id: "home", name: "Home", icon: Home, category: "Utility", description: "Home icon" },
  { id: "search", name: "Search", icon: Search, category: "Utility", description: "Search icon" },
  { id: "notifications", name: "Notifications", icon: Notifications, category: "Utility", description: "Notifications icon" },
  { id: "favorite", name: "Favorite", icon: Favorite, category: "Utility", description: "Favorite icon" }
];

export function getIconById(id: string): IconOption | undefined {
  return iconLibrary.find(icon => icon.id === id);
}

export function getIconCategories(): string[] {
  const uniqueCategories = new Set(iconLibrary.map(icon => icon.category));
  return Array.from(uniqueCategories);
}

export function searchIcons(query: string): IconOption[] {
  const searchTerm = query.toLowerCase();
  return iconLibrary.filter(icon => 
    icon.name.toLowerCase().includes(searchTerm) ||
    icon.description.toLowerCase().includes(searchTerm) ||
    icon.category.toLowerCase().includes(searchTerm)
  );
}
