"use client";

import React from "react";
import { ResponsiveHeader } from "./ResponsiveLayout";

export function Header() {
  return (
    <ResponsiveHeader sticky={false} transparent={false}>
      {/* Blank header - no content */}
    </ResponsiveHeader>
  );
}
