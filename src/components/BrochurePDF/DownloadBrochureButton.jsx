"use client";
import { Download, FileText } from "lucide-react";
export default function DownloadBrochureButton({ brochureData }) {
  const handleDownload = async () => {
    const response = await fetch("/api/brochure", {
      method: "POST",
      body: JSON.stringify(brochureData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("PDF generation failed");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${brochureData.slug}-brochure.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="text-xxs md:text-xs underline decoration-primary items-center inline-flex  gap-x-1  text-headings font-bold rounded-full hover:text-primary"
    >
      <Download className="h-4 w-4 text-primary" />
      Get Brochure
    </button>
  );
}
