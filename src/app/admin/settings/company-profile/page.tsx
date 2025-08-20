"use client";

import React from "react";
import { CompanyProfilePage } from "@/features/company-profile";

// Simple error boundary component
class CompanyProfileErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      "CompanyProfile Error Boundary caught an error:",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Something went wrong with the Company Profile page
          </h2>
          <p className="text-gray-600 mb-4">
            Please refresh the page or contact support if the problem persists.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function CompanyProfilePageWrapper() {
  return (
    <CompanyProfileErrorBoundary>
      <CompanyProfilePage />
    </CompanyProfileErrorBoundary>
  );
}
