import { buildLlmsBody } from "../build-body";

const fakeNotes = [
  {
    title: "How to Test",
    slug: "how-to-test",
    description: "A guide to testing",
  },
];

const fakeProjects = [
  {
    title: "My Portfolio",
    slug: "my-portfolio",
    description: "A portfolio project",
  },
];

describe("buildLlmsBody", () => {
  it("contains H1 heading with Andrew Tseng", () => {
    const body = buildLlmsBody(fakeNotes, fakeProjects);
    expect(body).toContain("# Andrew Tseng");
  });

  it("contains a Notes section", () => {
    const body = buildLlmsBody(fakeNotes, fakeProjects);
    expect(body).toContain("## Notes");
  });

  it("contains a Projects section", () => {
    const body = buildLlmsBody(fakeNotes, fakeProjects);
    expect(body).toContain("## Projects");
  });

  it("lists notes with title, url and description", () => {
    const body = buildLlmsBody(fakeNotes, fakeProjects);
    expect(body).toContain("[How to Test]");
    expect(body).toContain("/en/notes/how-to-test");
    expect(body).toContain("A guide to testing");
  });

  it("lists projects with title, url and description", () => {
    const body = buildLlmsBody(fakeNotes, fakeProjects);
    expect(body).toContain("[My Portfolio]");
    expect(body).toContain("/en/projects/my-portfolio");
    expect(body).toContain("A portfolio project");
  });

  it("returns plain text (no HTML)", () => {
    const body = buildLlmsBody(fakeNotes, fakeProjects);
    expect(body).not.toContain("<");
  });
});
