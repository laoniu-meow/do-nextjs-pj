"use client";

import { Header } from "@/components/layout/Header";

export default function Home() {
  // Default responsive settings
  const defaultSettings = {
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

  return (
    <div>
      <Header {...defaultSettings} />
      {/* Blank content - no other components */}
    </div>
  );
}
