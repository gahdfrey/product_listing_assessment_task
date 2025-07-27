import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import ImageContainer from "../../app/components/ImageContainer";

describe("ImageContainer", () => {
  const props = {
    src: "/images/test.jpg",
    alt: "Test Image",
    width: 200,
    height: 200,
  };

  it("renders with pulse animation while loading", () => {
    render(<ImageContainer {...props} />);
    const pulse = screen.getByTestId("pulse-placeholder");
    expect(pulse).toHaveClass("animate-pulse bg-gray-200");
    expect(pulse).toHaveStyle({ width: "200px", height: "200px" });
  });

  it("hides pulse animation after image loads", async () => {
    render(<ImageContainer {...props} />);
    const image = screen.getByRole("img", { name: "Test Image" });
    await act(async () => {
      fireEvent.load(image);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.queryByTestId("pulse-placeholder")).not.toBeInTheDocument();
  });

  it("shows fallback image on error", async () => {
    render(<ImageContainer {...props} />);
    const image = screen.getByRole("img", { name: "Test Image" });
    await act(async () => {
      fireEvent.error(image);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("front-view-shiny-new-football.jpg")
    );
    expect(screen.queryByTestId("pulse-placeholder")).not.toBeInTheDocument();
  });

  it("applies correct dimensions", () => {
    render(<ImageContainer {...props} />);
    const container = screen.getByRole("img", {
      name: "Test Image",
    }).parentElement;
    expect(container).toHaveStyle({ width: "200px", height: "200px" });
  });
});
