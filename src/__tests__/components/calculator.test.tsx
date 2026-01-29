import { render, screen, fireEvent } from "@testing-library/react";
import { BrokerageFeeCalculator } from "@/components/calculator";

describe("BrokerageFeeCalculator", () => {
  it("renders the calculator with initial elements", () => {
    render(<BrokerageFeeCalculator />);

    expect(screen.getByText("Brokerage Fee Calculator")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Annual Sales Volume ($)")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Current Split (Your %)")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /calculate my lost commission/i })
    ).toBeInTheDocument();
  });

  it("does not show results initially", () => {
    render(<BrokerageFeeCalculator />);

    expect(
      screen.queryByText(/You're potentially leaving behind/i)
    ).not.toBeInTheDocument();
  });

  it("allows entering annual sales volume", () => {
    render(<BrokerageFeeCalculator />);

    const volumeInput = screen.getByLabelText("Annual Sales Volume ($)");
    fireEvent.change(volumeInput, { target: { value: "5,000,000" } });

    expect(volumeInput).toHaveValue("5,000,000");
  });

  it("allows entering current split percentage", () => {
    render(<BrokerageFeeCalculator />);

    const splitInput = screen.getByLabelText("Current Split (Your %)");
    fireEvent.change(splitInput, { target: { value: "70" } });

    expect(splitInput).toHaveValue(70);
  });

  it("filters non-numeric characters from volume input", () => {
    render(<BrokerageFeeCalculator />);

    const volumeInput = screen.getByLabelText("Annual Sales Volume ($)");
    fireEvent.change(volumeInput, { target: { value: "$5,000,000abc" } });

    // Should only keep numbers and commas
    expect(volumeInput).toHaveValue("5,000,000");
  });

  it("calculates and displays results correctly", () => {
    render(<BrokerageFeeCalculator />);

    const volumeInput = screen.getByLabelText("Annual Sales Volume ($)");
    const splitInput = screen.getByLabelText("Current Split (Your %)");
    const calculateButton = screen.getByRole("button", {
      name: /calculate my lost commission/i,
    });

    fireEvent.change(volumeInput, { target: { value: "5,000,000" } });
    fireEvent.change(splitInput, { target: { value: "70" } });
    fireEvent.click(calculateButton);

    // With $5M volume at 3% commission = $150,000 total commission
    // At 70% split, agent gets $105,000
    // At 90% split, agent would get $135,000
    // Lost commission = $135,000 - $105,000 = $30,000
    expect(screen.getByText("$30,000")).toBeInTheDocument();
    expect(screen.getByText("$135,000")).toBeInTheDocument();
  });

  it("handles calculation with 90% split (no lost commission)", () => {
    render(<BrokerageFeeCalculator />);

    const volumeInput = screen.getByLabelText("Annual Sales Volume ($)");
    const splitInput = screen.getByLabelText("Current Split (Your %)");
    const calculateButton = screen.getByRole("button", {
      name: /calculate my lost commission/i,
    });

    fireEvent.change(volumeInput, { target: { value: "1,000,000" } });
    fireEvent.change(splitInput, { target: { value: "90" } });
    fireEvent.click(calculateButton);

    // At 90% split, there should be no lost commission
    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  it("handles calculation with split above 90%", () => {
    render(<BrokerageFeeCalculator />);

    const volumeInput = screen.getByLabelText("Annual Sales Volume ($)");
    const splitInput = screen.getByLabelText("Current Split (Your %)");
    const calculateButton = screen.getByRole("button", {
      name: /calculate my lost commission/i,
    });

    fireEvent.change(volumeInput, { target: { value: "1,000,000" } });
    fireEvent.change(splitInput, { target: { value: "95" } });
    fireEvent.click(calculateButton);

    // At 95% split, lost commission should still be $0 (clamped to positive values)
    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  it("does not calculate with invalid input", () => {
    render(<BrokerageFeeCalculator />);

    const calculateButton = screen.getByRole("button", {
      name: /calculate my lost commission/i,
    });

    fireEvent.click(calculateButton);

    // Should not show results with empty inputs
    expect(
      screen.queryByText(/You're potentially leaving behind/i)
    ).not.toBeInTheDocument();
  });

  it("does not calculate with split over 100%", () => {
    render(<BrokerageFeeCalculator />);

    const volumeInput = screen.getByLabelText("Annual Sales Volume ($)");
    const splitInput = screen.getByLabelText("Current Split (Your %)");
    const calculateButton = screen.getByRole("button", {
      name: /calculate my lost commission/i,
    });

    fireEvent.change(volumeInput, { target: { value: "1,000,000" } });
    fireEvent.change(splitInput, { target: { value: "150" } });
    fireEvent.click(calculateButton);

    // Should not calculate with invalid split percentage
    expect(
      screen.queryByText(/You're potentially leaving behind/i)
    ).not.toBeInTheDocument();
  });

  it("shows call-to-action after calculation", () => {
    render(<BrokerageFeeCalculator />);

    const volumeInput = screen.getByLabelText("Annual Sales Volume ($)");
    const splitInput = screen.getByLabelText("Current Split (Your %)");
    const calculateButton = screen.getByRole("button", {
      name: /calculate my lost commission/i,
    });

    fireEvent.change(volumeInput, { target: { value: "1,000,000" } });
    fireEvent.change(splitInput, { target: { value: "70" } });
    fireEvent.click(calculateButton);

    // Should show the CTA link
    expect(
      screen.getByRole("link", { name: /find better offers/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /find better offers/i })
    ).toHaveAttribute("href", "/auth/register?role=agent");
  });
});
