import { MenuItem } from '@/components/ui/MenuItemList'

// Admin Page Menu Data Structure
export const AdminPageMenu: MenuItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    href: '/admin/settings',
    children: [
      {
        id: 'settings-company-profile',
        label: 'Company Profile',
        href: '/admin/settings/company-profile'
      },
      {
        id: 'settings-header-main',
        label: 'Header & Main',
        href: '/admin/settings/header-main'
      },
      {
        id: 'settings-footer',
        label: 'Footer',
        href: '/admin/settings/footer'
      },
      {
        id: 'settings-hero-page',
        label: 'Hero Page',
        href: '/admin/settings/hero-page'
      },
      {
        id: 'settings-pages',
        label: 'Pages',
        href: '/admin/settings/pages'
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
      if (item.href && currentPath.startsWith(item.href)) {
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
