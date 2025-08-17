import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessIcon from "@mui/icons-material/Business";
import HeaderIcon from "@mui/icons-material/ViewHeadline";
import FooterIcon from "@mui/icons-material/ViewQuilt";
import HeroIcon from "@mui/icons-material/Star";
import PagesIcon from "@mui/icons-material/Pages";

export interface MenuItem {
  id: string;
  text: string;
  icon: React.ComponentType;
  action?: () => void;
  children?: MenuItem[];
  divider?: boolean;
  variant?: 'default' | 'error' | 'primary';
}

export interface MenuConfig {
  mainItems: MenuItem[];
  settingsItems: MenuItem[];
  logoutItem: MenuItem;
}

export const defaultMenuConfig: MenuConfig = {
  mainItems: [
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: DashboardIcon,
      action: () => console.log('Dashboard clicked'),
    },
    {
      id: 'users',
      text: 'Users',
      icon: PeopleIcon,
      action: () => console.log('Users clicked'),
    },
  ],
  settingsItems: [
    {
      id: 'company-profile',
      text: 'Company Profile',
      icon: BusinessIcon,
      action: () => console.log('Company Profile clicked'),
    },
    {
      id: 'header-main',
      text: 'Header & Main',
      icon: HeaderIcon,
      action: () => console.log('Header & Main clicked'),
    },
    {
      id: 'footer',
      text: 'Footer',
      icon: FooterIcon,
      action: () => console.log('Footer clicked'),
    },
    {
      id: 'hero-page',
      text: 'Hero Page',
      icon: HeroIcon,
      action: () => console.log('Hero Page clicked'),
    },
    {
      id: 'pages',
      text: 'Pages',
      icon: PagesIcon,
      action: () => console.log('Pages clicked'),
    },
  ],
  logoutItem: {
    id: 'logout',
    text: 'Logout',
    icon: LogoutIcon,
    action: () => console.log('Logout clicked'),
    variant: 'error',
  },
};
