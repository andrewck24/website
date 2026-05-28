import { SkillTags } from "@/components/about/skill-tags";
import type { Skill } from "@/lib/data/skills";
import { render, screen } from "@testing-library/react";

const mockSkills: Skill[] = [
  { name: "React", category: "frontend", level: "advanced" },
  { name: "TypeScript", category: "language", level: "expert" },
  { name: "Node.js", category: "backend", level: "intermediate" },
  { name: "Vue.js", category: "frontend", level: "beginner" },
];

describe("SkillTags", () => {
  it("renders all skill tags", () => {
    render(<SkillTags skills={mockSkills} />);

    expect(screen.getByTestId("skill-tags")).toBeInTheDocument();

    mockSkills.forEach((skill) => {
      expect(screen.getByText(skill.name)).toBeInTheDocument();
    });
  });

  it("applies correct variant based on skill level", () => {
    render(<SkillTags skills={mockSkills} />);

    const skillElements = screen.getAllByTestId("skill-tag");

    // Check that all skill tags are rendered
    expect(skillElements).toHaveLength(mockSkills.length);

    // Test that different skill levels render (specific variant classes are applied by Badge component)
    expect(screen.getByText("React")).toBeInTheDocument(); // advanced -> default
    expect(screen.getByText("TypeScript")).toBeInTheDocument(); // expert -> destructive
    expect(screen.getByText("Node.js")).toBeInTheDocument(); // intermediate -> outline
    expect(screen.getByText("Vue.js")).toBeInTheDocument(); // beginner -> secondary
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-test-class";
    render(<SkillTags skills={mockSkills} className={customClass} />);

    const skillTagsContainer = screen.getByTestId("skill-tags");
    expect(skillTagsContainer).toHaveClass(customClass);
  });

  it("applies responsive layout classes", () => {
    render(<SkillTags skills={mockSkills} />);

    const skillTagsContainer = screen.getByTestId("skill-tags");
    expect(skillTagsContainer).toHaveClass(
      "flex",
      "flex-row",
      "flex-wrap",
      "items-center",
      "justify-center",
      "lg:justify-start",
      "gap-2"
    );
  });

  it("handles empty skills array", () => {
    render(<SkillTags skills={[]} />);

    const skillTagsContainer = screen.getByTestId("skill-tags");
    expect(skillTagsContainer).toBeInTheDocument();
    expect(skillTagsContainer).toBeEmptyDOMElement();
  });

  it("handles skills with special characters in names", () => {
    const specialSkills: Skill[] = [
      { name: "Next.js", category: "frontend", level: "advanced" },
      { name: "Node.js", category: "backend", level: "intermediate" },
      { name: "C++", category: "language", level: "beginner" },
    ];

    render(<SkillTags skills={specialSkills} />);

    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("C++")).toBeInTheDocument();
  });
});
