import { render, screen } from "@testing-library/react";
import PropertyList from "./PropertyList";

type Property = {
  id: string;
  name: string;
  suburb: string;
  status: "occupied" | "vacant";
};

const sampleProperties: Property[] = [
  {
    id: "1",
    name: "36 Chatsworth Drive",
    suburb: "Carramar",
    status: "occupied",
  },
  { id: "2", name: "11 Staunton Vale", suburb: "Carramar", status: "vacant" },
];

describe("PropertyList", () => {
  it("shows a heading for the properties section", () => {
    render(<PropertyList properties={sampleProperties} />);

    const heading = screen.getByRole("heading", { name: /your properties/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders each property name and suburb", () => {
    render(<PropertyList properties={sampleProperties} />);

    expect(screen.getByText(/36 chatsworth drive/i)).toBeInTheDocument();
    expect(screen.getByText(/11 staunton vale/i)).toBeInTheDocument();

    const suburbs = screen.getAllByText(/carramar/i);
    expect(suburbs).toHaveLength(2);
  });

  it("shows a friendly message when there are no properties", () => {
    render(<PropertyList properties={[]} />);

    expect(
      screen.getByText(/you don’t have any properties yet/i)
    ).toBeInTheDocument();
  });
});
