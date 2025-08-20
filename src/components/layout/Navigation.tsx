"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className = "" }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", description: "Main landing page" },
    { href: "/admin", label: "Admin", description: "Admin panel" },
    {
      href: "/admin/settings/company-profile",
      label: "Company Profile",
      description: "Company profile settings",
    },
    {
      href: "/admin/settings/header-settings",
      label: "Header & Main",
      description: "Header and main layout settings",
    },
  ];

  return (
    <nav className={`navigation ${className}`}>
      <div className="navigation-container">
        <h3 className="navigation-title">Navigation</h3>
        <div className="navigation-items">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`navigation-item ${isActive ? "active" : ""}`}
              >
                <div className="navigation-item-content">
                  <span className="navigation-label">{item.label}</span>
                  <span className="navigation-description">
                    {item.description}
                  </span>
                </div>
                {isActive && <div className="navigation-indicator" />}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
