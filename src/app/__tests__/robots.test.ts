import robots from "../robots";

describe("robots", () => {
  const result = robots();
  const disallow = (result.rules as { disallow: string[] }[])[0].disallow;

  it("disallow list contains /studio/", () => {
    expect(disallow).toContain("/studio/");
  });

  it("disallow list does not contain *.json", () => {
    expect(disallow).not.toContain("*.json");
  });
});
