import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../header";

describe("Header", () => {
  it("renders the company name", () => {
    render(<Header />);
    const companyName = screen.getByText(/Industrial IoT/i);
    expect(companyName).toBeInTheDocument();
  });
});
