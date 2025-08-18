import { MenuItem } from '@/components/ui/config/menuConfig'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsIcon from '@mui/icons-material/Settings'
import BusinessIcon from '@mui/icons-material/Business'
import HeaderIcon from '@mui/icons-material/ViewHeadline'
import FooterIcon from '@mui/icons-material/ViewQuilt'
import HeroIcon from '@mui/icons-material/Star'
import PagesIcon from '@mui/icons-material/Pages'
import IconLibraryIcon from '@mui/icons-material/EmojiEmotions'

// Admin Page Menu Data Structure
export const AdminPageMenu: MenuItem[] = [
  {
    id: 'dashboard',
    text: 'Dashboard',
    icon: DashboardIcon,
    action: () => {
      // TODO: Implement dashboard navigation logic
    },
  },
  {
    id: 'icon-library',
    text: 'Icon Library',
    icon: IconLibraryIcon,
    action: () => {
      // TODO: Implement icon library navigation logic
    },
  },
  {
    id: 'settings',
    text: 'Settings',
    icon: SettingsIcon,
    children: [
      {
        id: 'settings-company-profile',
        text: 'Company Profile',
        icon: BusinessIcon,
        action: () => {
          // TODO: Implement company profile navigation logic
        },
      },
      {
        id: 'settings-header-settings',
        text: 'Header & Main',
        icon: HeaderIcon,
        action: () => {
          // TODO: Implement header & main navigation logic
        },
      },
      {
        id: 'settings-footer',
        text: 'Footer',
        icon: FooterIcon,
        action: () => {
          // TODO: Implement footer navigation logic
        },
      },
      {
        id: 'settings-hero-page',
        text: 'Hero Page',
        icon: HeroIcon,
        action: () => {
          // TODO: Implement hero page navigation logic
        },
      },
      {
        id: 'settings-pages',
        text: 'Pages',
        icon: PagesIcon,
        action: () => {
          // TODO: Implement pages navigation logic
        },
      }
    ]
  }
]

// Helper function to find menu item by ID
export function findMenuItemById(items: MenuItem[], id: string): MenuItem | null {
  for (const item of items) {
    if (item.id === id) {
      return item
    }
    if (item.children) {
      const found = findMenuItemById(item.children, id)
      if (found) return found
    }
  }
  return null
}

// Helper function to get breadcrumb path
export function getBreadcrumbPath(items: MenuItem[], targetId: string): MenuItem[] {
  const path: MenuItem[] = []
  
  function findPath(items: MenuItem[], targetId: string, currentPath: MenuItem[]): boolean {
    for (const item of items) {
      const newPath = [...currentPath, item]
      
      if (item.id === targetId) {
        path.push(...newPath)
        return true
      }
      
      if (item.children && findPath(item.children, targetId, newPath)) {
        return true
      }
    }
    return false
  }
  
  findPath(items, targetId, [])
  return path
}

// Helper function to get all menu items flattened
export function getFlattenedMenuItems(items: MenuItem[]): MenuItem[] {
  const flattened: MenuItem[] = []
  
  function flatten(items: MenuItem[]) {
    for (const item of items) {
      flattened.push(item)
      if (item.children) {
        flatten(item.children)
      }
    }
  }
  
  flatten(items)
  return flattened
}

// Helper function to check if menu item is active
export function isMenuItemActive(items: MenuItem[], currentPath: string): string[] {
  const activeIds: string[] = []
  
  function checkActive(items: MenuItem[]) {
    for (const item of items) {
      // Since we no longer have href, we'll check by id or implement a different active logic
      if (item.id && currentPath.includes(item.id)) {
        activeIds.push(item.id)
      }
      if (item.children) {
        checkActive(item.children)
      }
    }
  }
  
  checkActive(items)
  return activeIds
}

// Export types for external use
export type { MenuItem }
