import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessIcon from "@mui/icons-material/Business";
import HeaderIcon from "@mui/icons-material/ViewHeadline";
import FooterIcon from "@mui/icons-material/ViewQuilt";
import HeroIcon from "@mui/icons-material/Star";
import PagesIcon from "@mui/icons-material/Pages";
import SettingsIcon from "@mui/icons-material/Settings";

export interface MenuItem {
  id: string;
  text: string;
  icon: React.ComponentType;
  action?: () => void;
  href?: string;
  children?: MenuItem[];
  variant?: 'default' | 'error' | 'primary';
}

export interface MenuConfig {
  mainItems: MenuItem[];
  logoutItem: MenuItem;
}

export const defaultMenuConfig: MenuConfig = {
  mainItems: [
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: DashboardIcon,
      href: '/admin',
    },
    {
      id: 'users',
      text: 'Users',
      icon: PeopleIcon,
      href: '/admin/users',
    },
    {
      id: 'settings',
      text: 'Settings',
      icon: SettingsIcon,
      href: '/admin/settings',
      children: [
        {
          id: 'company-profile',
          text: 'Company Profile',
          icon: BusinessIcon,
          href: '/admin/settings/company-profile',
        },
        {
          id: 'header-main',
          text: 'Header & Main',
          icon: HeaderIcon,
          href: '/admin/settings/header-main',
        },
        {
          id: 'footer',
          text: 'Footer',
          icon: FooterIcon,
          href: '/admin/settings/footer',
        },
        {
          id: 'hero-page',
          text: 'Hero Page',
          icon: HeroIcon,
          href: '/admin/settings/hero-page',
        },
        {
          id: 'pages',
          text: 'Pages',
          icon: PagesIcon,
          href: '/admin/settings/pages',
        },
      ],
    },
  ],
  logoutItem: {
    id: 'logout',
    text: 'Logout',
    icon: LogoutIcon,
    action: () => {
      // TODO: Implement proper logout functionality
      // For now, just close the drawer
    },
    variant: 'error',
  },
};
