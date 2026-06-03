import React from "react";
import { render, screen } from "@testing-library/react";
import { ResumeDialog } from "../resume-dialog";

describe("ResumeDialog", () => {
  it("shows zh download link when pdfUrls.zh is non-null (zh-TW locale)", () => {
    render(
      <ResumeDialog
        lang="zh-TW"
        pdfUrls={{ zh: "https://cdn.sanity.io/files/zh.pdf", en: null }}
        defaultOpen={true}
      />
    );
    expect(screen.getByText("中文")).toBeInTheDocument();
  });

  it("shows en download link when pdfUrls.en is non-null (en locale)", () => {
    render(
      <ResumeDialog
        lang="en"
        pdfUrls={{ zh: null, en: "https://cdn.sanity.io/files/en.pdf" }}
        defaultOpen={true}
      />
    );
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("does not show zh link when pdfUrls.zh is null", () => {
    render(
      <ResumeDialog
        lang="zh-TW"
        pdfUrls={{ zh: null, en: "https://cdn.sanity.io/files/en.pdf" }}
        defaultOpen={true}
      />
    );
    expect(screen.queryByText("中文")).not.toBeInTheDocument();
  });

  it("shows dialog title in zh-TW locale", () => {
    render(
      <ResumeDialog
        lang="zh-TW"
        pdfUrls={{ zh: "https://cdn.sanity.io/files/zh.pdf", en: null }}
        defaultOpen={true}
      />
    );
    expect(screen.getByText("下載履歷 PDF")).toBeInTheDocument();
  });

  it("shows dialog title in en locale", () => {
    render(
      <ResumeDialog
        lang="en"
        pdfUrls={{ zh: null, en: "https://cdn.sanity.io/files/en.pdf" }}
        defaultOpen={true}
      />
    );
    expect(screen.getByText("Download Resume PDF")).toBeInTheDocument();
  });

  it("each link has target=_blank and rel=noopener noreferrer", () => {
    render(
      <ResumeDialog
        lang="en"
        pdfUrls={{
          zh: "https://cdn.sanity.io/files/zh.pdf",
          en: "https://cdn.sanity.io/files/en.pdf",
        }}
        defaultOpen={true}
      />
    );
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("shows both links when both pdfUrls are non-null", () => {
    render(
      <ResumeDialog
        lang="en"
        pdfUrls={{
          zh: "https://cdn.sanity.io/files/zh.pdf",
          en: "https://cdn.sanity.io/files/en.pdf",
        }}
        defaultOpen={true}
      />
    );
    expect(screen.getByText("Traditional Chinese")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });
});
