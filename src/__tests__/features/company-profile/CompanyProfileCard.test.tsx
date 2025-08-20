/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CompanyProfileCard } from "../../../features/company-profile/components/CompanyProfileCard";
import { CompanyFormData } from "../../../types";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt = "", ...props }: React.ComponentProps<"img">) => (
    <img alt={alt} {...props} />
  ),
}));

describe("CompanyProfileCard", () => {
  const mockCompany: CompanyFormData = {
    name: "Test Company",
    logo: "test-logo.png",
    logoUrl: "/test-logo.png",
    companyRegNumber: "REG123456",
    email: "test@company.com",
    address: "123 Test Street",
    country: "Test Country",
    postalCode: "12345",
    contact: "+1-555-123-4567",
  };

  const defaultProps = {
    company: mockCompany,
    index: 0,
    onEdit: jest.fn(),
    onRemove: jest.fn(),
    isMainCompany: true,
  };

  it("renders company information correctly", () => {
    render(<CompanyProfileCard {...defaultProps} />);

    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("Main Company")).toBeInTheDocument();
    expect(screen.getByText("test@company.com")).toBeInTheDocument();
    expect(screen.getByText("+1-555-123-4567")).toBeInTheDocument();
    expect(
      screen.getByText("123 Test Street, Test Country 12345")
    ).toBeInTheDocument();
    expect(screen.getByText("REG123456")).toBeInTheDocument();
  });

  it("displays company logo when provided", () => {
    render(<CompanyProfileCard {...defaultProps} />);

    const logo = screen.getByAltText("Test Company logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/test-logo.png");
  });

  it("displays business icon when no logo is provided", () => {
    const companyWithoutLogo = { ...mockCompany, logoUrl: "" };
    render(
      <CompanyProfileCard {...defaultProps} company={companyWithoutLogo} />
    );

    // Should show business icon instead of logo
    expect(screen.queryByAltText("Test Company logo")).not.toBeInTheDocument();
  });

  it('shows "Remote" label for non-main companies', () => {
    render(<CompanyProfileCard {...defaultProps} isMainCompany={false} />);

    expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.queryByText("Main Company")).not.toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const mockOnEdit = jest.fn();
    render(<CompanyProfileCard {...defaultProps} onEdit={mockOnEdit} />);

    const editButton = screen.getByTitle("Edit Company");
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockCompany, 0);
  });

  it("calls onRemove when remove button is clicked", () => {
    const mockOnRemove = jest.fn();
    render(<CompanyProfileCard {...defaultProps} onRemove={mockOnRemove} />);

    const removeButton = screen.getByTitle("Remove Company");
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });

  it("does not show remove button for main company (index 0)", () => {
    render(<CompanyProfileCard {...defaultProps} index={0} />);

    const removeButton = screen.queryByTitle("Remove Company");
    expect(removeButton).not.toBeInTheDocument();
  });

  it("shows remove button for remote companies (index > 0)", () => {
    render(<CompanyProfileCard {...defaultProps} index={1} />);

    const removeButton = screen.getByTitle("Remove Company");
    expect(removeButton).toBeInTheDocument();
  });

  it("handles missing optional fields gracefully", () => {
    const minimalCompany: CompanyFormData = {
      name: "Minimal Company",
    };

    render(<CompanyProfileCard {...defaultProps} company={minimalCompany} />);

    expect(screen.getByText("Minimal Company")).toBeInTheDocument();
    expect(screen.queryByText("Email")).not.toBeInTheDocument();
    expect(screen.queryByText("Contact")).not.toBeInTheDocument();
    expect(screen.queryByText("Address")).not.toBeInTheDocument();
    expect(screen.queryByText("Registration Number")).not.toBeInTheDocument();
  });

  it("applies hover effects and transitions", () => {
    render(<CompanyProfileCard {...defaultProps} />);

    const card = screen.getByText("Test Company").closest("div");
    expect(card).toHaveStyle({
      transition: "all 0.2s ease-in-out",
    });
  });
});
