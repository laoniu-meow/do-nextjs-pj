import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CompanyHeader } from "../../components/company/CompanyHeader";

describe("CompanyHeader", () => {
  const defaultProps = {
    companyName: "Test Company",
    logo: "/test-logo.png",
    onLogoClick: jest.fn(),
  };

  it("renders company name correctly", () => {
    render(<CompanyHeader {...defaultProps} />);

    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("Company Dashboard")).toBeInTheDocument();
  });

  it("displays company logo when provided", () => {
    render(<CompanyHeader {...defaultProps} />);

    const logo = screen.getByAltText("Test Company logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/test-logo.png");
  });

  it("displays business icon when no logo is provided", () => {
    render(<CompanyHeader companyName="Test Company" logo="" />);

    // Should show business icon instead of logo
    expect(screen.queryByAltText("Test Company logo")).not.toBeInTheDocument();
  });

  it("calls onLogoClick when logo is clicked", () => {
    const mockOnLogoClick = jest.fn();
    render(<CompanyHeader {...defaultProps} onLogoClick={mockOnLogoClick} />);

    const logo = screen.getByAltText("Test Company logo");
    fireEvent.click(logo);

    expect(mockOnLogoClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onLogoClick when no callback is provided", () => {
    render(<CompanyHeader companyName="Test Company" logo="/test-logo.png" />);

    const logo = screen.getByAltText("Test Company logo");
    fireEvent.click(logo);

    // Should not throw error
    expect(logo).toBeInTheDocument();
  });

  it("shows edit icon when onLogoClick is provided", () => {
    render(<CompanyHeader {...defaultProps} />);

    const editIcon = screen.getByLabelText("Change logo");
    expect(editIcon).toBeInTheDocument();
  });

  it("does not show edit icon when onLogoClick is not provided", () => {
    render(<CompanyHeader companyName="Test Company" logo="/test-logo.png" />);

    const editIcon = screen.queryByLabelText("Change logo");
    expect(editIcon).not.toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    render(<CompanyHeader {...defaultProps} />);

    const header = screen.getByText("Test Company").closest("div");
    expect(header).toHaveStyle({
      display: "flex",
      alignItems: "center",
    });
  });
});
