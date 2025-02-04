import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "./test-utils/test-utils";
import App from "./App";

describe("App", () => {
  it("renders main components correctly", () => {
    render(<App />);

    // Test that main layout components are present
    const headers = screen.getAllByRole("banner");
    expect(headers.length).toBeGreaterThan(0);
    expect(screen.getByRole("main")).toBeInTheDocument();

    // Test for the title
    expect(
      screen.getByText("SoT USN Voyage Log Generator")
    ).toBeInTheDocument();

    // Test for main sections
    expect(screen.getByText("Log Entry")).toBeInTheDocument();
    expect(screen.getByText("Notable Events")).toBeInTheDocument();
    expect(screen.getByText("Crew Manifest")).toBeInTheDocument();

    // Test for buttons
    expect(screen.getByText("Generate PDF(s)")).toBeInTheDocument();
    expect(screen.getByText("Generate Image(s)")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
    expect(screen.getByText("Copy Discord Message")).toBeInTheDocument();
  });
});
