import React from "react";
import { render, screen } from "@testing-library/react";
import { ResumeDialog } from "../resume-dialog";

describe("ResumeDialog", () => {
  it("shows tw download link when pdfUrls.tw is non-null (zh-TW locale)", () => {
    render(
      <ResumeDialog
        lang="zh-TW"
        pdfUrls={{
          tw: "https://cdn.sanity.io/files/tw.pdf",
          en: null,
          ja: null,
        }}
        defaultOpen={true}
      />
    );
    expect(screen.getByText("中文")).toBeInTheDocument();
  });

  it("shows en download link when pdfUrls.en is non-null (en locale)", () => {
    render(
      <ResumeDialog
        lang="en"
        pdfUrls={{
          tw: null,
          en: "https://cdn.sanity.io/files/en.pdf",
          ja: null,
        }}
        defaultOpen={true}
      />
    );
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("shows ja download link when pdfUrls.ja is non-null (ja locale)", () => {
    render(
      <ResumeDialog
        lang="ja"
        pdfUrls={{
          tw: null,
          en: null,
          ja: "https://cdn.sanity.io/files/ja.pdf",
        }}
        defaultOpen={true}
      />
    );
    expect(screen.getByText("日本語")).toBeInTheDocument();
  });

  it("does not show tw link when pdfUrls.tw is null", () => {
    render(
      <ResumeDialog
        lang="zh-TW"
        pdfUrls={{
          tw: null,
          en: "https://cdn.sanity.io/files/en.pdf",
          ja: null,
        }}
        defaultOpen={true}
      />
    );
    expect(screen.queryByText("中文")).not.toBeInTheDocument();
  });

  it("does not show ja link when pdfUrls.ja is null", () => {
    render(
      <ResumeDialog
        lang="ja"
        pdfUrls={{
          tw: "https://cdn.sanity.io/files/tw.pdf",
          en: null,
          ja: null,
        }}
        defaultOpen={true}
      />
    );
    expect(screen.queryByText("日本語")).not.toBeInTheDocument();
  });

  it("shows dialog title in zh-TW locale", () => {
    render(
      <ResumeDialog
        lang="zh-TW"
        pdfUrls={{
          tw: "https://cdn.sanity.io/files/tw.pdf",
          en: null,
          ja: null,
        }}
        defaultOpen={true}
      />
    );
    expect(screen.getByText("下載履歷 PDF")).toBeInTheDocument();
  });

  it("shows dialog title in en locale", () => {
    render(
      <ResumeDialog
        lang="en"
        pdfUrls={{
          tw: null,
          en: "https://cdn.sanity.io/files/en.pdf",
          ja: null,
        }}
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
          tw: "https://cdn.sanity.io/files/tw.pdf",
          en: "https://cdn.sanity.io/files/en.pdf",
          ja: "https://cdn.sanity.io/files/ja.pdf",
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

  it("shows all three links when all pdfUrls are non-null", () => {
    render(
      <ResumeDialog
        lang="en"
        pdfUrls={{
          tw: "https://cdn.sanity.io/files/tw.pdf",
          en: "https://cdn.sanity.io/files/en.pdf",
          ja: "https://cdn.sanity.io/files/ja.pdf",
        }}
        defaultOpen={true}
      />
    );
    expect(screen.getByText("Traditional Chinese")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Japanese")).toBeInTheDocument();
  });
});
