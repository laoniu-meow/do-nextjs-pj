"use client";

import { Header, Main } from "@/components/layout";

export default function Home() {
  // Default responsive settings for Header
  const headerSettings = {
    desktop: {
      height: 64,
      paddingHorizontal: 16,
      paddingVertical: 8,
      logoWidth: 40,
      logoHeight: 40,
      quickButtonSize: 40,
      menuButtonSize: 40,
    },
    tablet: {
      height: 64,
      paddingHorizontal: 16,
      paddingVertical: 8,
      logoWidth: 40,
      logoHeight: 40,
      quickButtonSize: 40,
      menuButtonSize: 40,
    },
    mobile: {
      height: 64,
      paddingHorizontal: 16,
      paddingVertical: 8,
      logoWidth: 40,
      logoHeight: 40,
      quickButtonSize: 40,
      menuButtonSize: 40,
    },
  };

  // Default responsive settings for Main
  const mainSettings = {
    desktop: {
      paddingHorizontal: 32,
      paddingVertical: 24,
      maxWidth: 1200,
      minHeight: 600,
    },
    tablet: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      maxWidth: 900,
      minHeight: 500,
    },
    mobile: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      maxWidth: 600,
      minHeight: 400,
    },
    backgroundColor: "#ffffff",
    backgroundImage: "",
    backgroundGradient: "subtle" as const,
    borderRadius: "medium" as const,
    shadow: "light" as const,
  };

  return (
    <div className="home-page">
      <Header {...headerSettings} />
      <Main {...mainSettings}>
        <div className="home-content">
          <h1 className="home-title">Welcome to Company WebApp</h1>
          <p className="home-description">
            A modern, responsive web application built with Next.js, featuring
            Header and Main components that work seamlessly together.
          </p>

          <div className="home-actions">
            <a
              href="/admin/settings/header-settings"
              className="home-button primary"
            >
              Header Settings
            </a>
            <a href="/admin" className="home-button secondary">
              Admin Panel
            </a>
          </div>

          <div className="home-features">
            <div className="home-feature">
              <h3>🚀 Header Component</h3>
              <p>
                Responsive navigation with customizable branding and quick
                actions
              </p>
            </div>
            <div className="home-feature">
              <h3>📱 Main Component</h3>
              <p>
                Flexible content area with responsive design and custom styling
              </p>
            </div>
            <div className="home-feature">
              <h3>⚡ Performance</h3>
              <p>Built with React best practices and optimized rendering</p>
            </div>
          </div>
        </div>
      </Main>
    </div>
  );
}
