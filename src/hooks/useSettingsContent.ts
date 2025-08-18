import { usePathname } from "next/navigation";
import { useMemo } from "react";

export type SettingsPageType = 
  | "company-profile"
  | "header-settings"
  | "footer"
  | "hero-page"
  | "pages"
  | "users"
  | "dashboard"
  | "menu-navigation"
  | "quick-navigation"
  | "default";

export interface SettingsContent {
  title: string;
  description: string;
  content: React.ReactNode;
  pageType: SettingsPageType;
}

export function useSettingsContent(): SettingsContent | null {
  const pathname = usePathname();

  const settingsContent = useMemo((): SettingsContent | null => {
    // Extract the page type from the pathname
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Check if we're in admin section
    if (pathSegments[0] === 'admin') {
      // Settings pages
      if (pathSegments[1] === 'settings') {
        const pageType = pathSegments[2] as SettingsPageType;
        
        switch (pageType) {
          case 'company-profile':
            return {
              title: "Company Profile Settings",
              description: "Configure your company profile, branding, and company-specific settings.",
              pageType: "company-profile",
              content: null, // Will be set by the component using this hook
            };
          
          case 'header-settings':
            return {
              title: "Header & Main Settings",
              description: "Customize your website header, navigation, and main layout settings.",
              pageType: "header-settings",
              content: null,
            };
          
          case 'footer':
            return {
              title: "Footer Settings",
              description: "Configure your website footer, links, and footer-specific content.",
              pageType: "footer",
              content: null,
            };
          
          case 'hero-page':
            return {
              title: "Hero Page Settings",
              description: "Set up your hero section, main banner, and landing page content.",
              pageType: "hero-page",
              content: null,
            };
          
          case 'pages':
            return {
              title: "Pages Settings",
              description: "Manage your website pages, content structure, and page-specific settings.",
              pageType: "pages",
              content: null,
            };
          
          default:
            return {
              title: "Settings",
              description: "Configure your application settings.",
              pageType: "default",
              content: null,
            };
        }
      }
      
      // Other admin pages
      if (pathSegments[1] === 'users') {
        return {
          title: "User Management Settings",
          description: "Configure user roles, permissions, and user-related settings.",
          pageType: "users",
          content: null,
        };
      }
      
      if (pathSegments[1] === 'menu-navigation') {
        return {
          title: "Menu Navigation Settings",
          description: "Configure your website navigation menu structure and behavior.",
          pageType: "menu-navigation",
          content: null,
        };
      }
      
      if (pathSegments[1] === 'quick-navigation') {
        return {
          title: "Quick Navigation Settings",
          description: "Set up quick access navigation and shortcuts.",
          pageType: "quick-navigation",
          content: null,
        };
      }
      
      if (pathSegments[1] === 'dashboard' || pathSegments.length === 1) {
        return {
          title: "Dashboard Settings",
          description: "Configure your dashboard layout, widgets, and display options.",
          pageType: "dashboard",
          content: null,
        };
      }
    }
    
    // Default case - not in admin section
    return {
      title: "Settings",
      description: "Configure your application settings.",
      pageType: "default",
      content: null,
    };
  }, [pathname]);

  return settingsContent;
}
