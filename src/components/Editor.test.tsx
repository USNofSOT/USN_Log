import React from "react";
import "@testing-library/jest-dom";
import { render, screen, within } from "../test-utils/test-utils";
import userEvent from "@testing-library/user-event";
import { Editor } from "./Editor";
import { LogPreview } from "./LogPreview";

describe("Editor and Preview Integration", () => {
  it("updates preview when editing in Patrol mode", async () => {
    const user = userEvent.setup();

    // Render both components within the test-utils wrapper (which includes LogProvider)
    render(
      <>
        <Editor />
        <LogPreview />
      </>
    );

    // Fill in the form fields
    await user.type(
      screen.getByPlaceholderText("Enter log title..."),
      "Test Patrol Mission"
    );
    await user.type(
      screen.getByPlaceholderText("Write your log entry..."),
      "This is a test patrol log entry."
    );

    // Add events
    await user.type(
      screen.getByPlaceholderText("Enter events (one per line)..."),
      "Found treasure\nDefeated skeleton ship"
    );

    // Add crew members
    await user.type(
      screen.getByPlaceholderText("Enter crew members..."),
      "Captain Test\nFirst Mate Jest"
    );

    // Add gold and doubloons
    await user.type(
      screen.getByPlaceholderText("Enter gold amount..."),
      "5000"
    );
    await user.type(
      screen.getByPlaceholderText("Enter doubloons amount..."),
      "50"
    );

    // Add signature and subtitle
    await user.type(
      screen.getByPlaceholderText(/Enter rank or custom subtitle.../i),
      "Test Captain"
    );
    const signatureTextarea = screen.getAllByRole("textbox")[6]; // Get the signature textarea
    await user.type(signatureTextarea, "Captain Tester");

    // Get the preview section
    const previewSection = screen.getByTestId("log-preview");

    // Verify the preview shows the entered content
    expect(
      within(previewSection).getByText("Test Patrol Mission")
    ).toBeInTheDocument();
    expect(
      within(previewSection).getByText("This is a test patrol log entry.")
    ).toBeInTheDocument();
    expect(
      within(previewSection).getByText("Found treasure")
    ).toBeInTheDocument();
    expect(
      within(previewSection).getByText("Defeated skeleton ship")
    ).toBeInTheDocument();
    expect(
      within(previewSection).getByText("Captain Test")
    ).toBeInTheDocument();
    expect(
      within(previewSection).getByText("First Mate Jest")
    ).toBeInTheDocument();
    expect(within(previewSection).getByText("5000")).toBeInTheDocument();
    expect(within(previewSection).getByText("50")).toBeInTheDocument();
    expect(
      within(previewSection).getByText("Captain Tester")
    ).toBeInTheDocument();
    expect(
      within(previewSection).getByText("Test Captain")
    ).toBeInTheDocument();
  });

  it("handles ship selection in Patrol mode", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Editor />
        <LogPreview />
      </>
    );

    // Find the ship select by its ID
    const shipSelect = screen.getByRole("combobox", { name: /select ship/i });
    await user.selectOptions(shipSelect, "tyr");

    // Verify the ship image changes in the preview
    const previewSection = screen.getByTestId("log-preview");
    const shipImage = within(previewSection).getByAltText("Ship Logo");
    expect(shipImage).toHaveAttribute(
      "src",
      expect.stringContaining("tyr.png")
    );
  });

  it("resets form when clicking reset button", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Editor />
        <LogPreview />
      </>
    );

    // Fill in some data
    await user.type(
      screen.getByPlaceholderText("Enter log title..."),
      "Test Title"
    );
    await user.type(
      screen.getByPlaceholderText("Write your log entry..."),
      "Test Entry"
    );

    // Click reset button
    await user.click(screen.getByText("Reset"));

    // Verify fields are cleared
    expect(screen.getByPlaceholderText("Enter log title...")).toHaveValue("");
    expect(screen.getByPlaceholderText("Write your log entry...")).toHaveValue(
      ""
    );

    // Get the preview section
    const previewSection = screen.getByTestId("log-preview");

    // Verify preview is reset to default state
    const defaultTitle = within(previewSection).getByText("Log Title");
    expect(defaultTitle).toBeInTheDocument();
    expect(
      within(previewSection).getByText("Your log entry will appear here...")
    ).toBeInTheDocument();
  });
});
