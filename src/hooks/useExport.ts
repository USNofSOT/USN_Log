import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

interface UseExportProps {
  title: string;
  activePageIndex: number;
  setActivePageIndex: (index: number) => void;
  pages: string[];
  formatDiscordMessage: () => string;
}

export const useExport = ({
  title,
  activePageIndex,
  setActivePageIndex,
  pages,
  formatDiscordMessage,
}: UseExportProps) => {
  const makeFileName = (pageIndex: number, ext = "png") => {
    const base = title ? title.replace(/\s+/g, "-") : "Voyage_Log";
    return `${base}_page${pageIndex + 1}.${ext}`;
  };

  const generatePDF = async () => {
    const originalActive = activePageIndex;

    for (let i = 0; i < pages.length; i++) {
      setActivePageIndex(i);
      await new Promise((r) => setTimeout(r, 100));
      const pageEl = document.getElementById("visible-page");
      if (!pageEl) continue;

      const fileName = makeFileName(i, "pdf");
      const opt = {
        margin: 0,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          width: 816,
          height: 1056,
        },
        jsPDF: {
          unit: "px",
          format: [816, 1056],
          orientation: "portrait",
        },
      };
      await html2pdf().set(opt).from(pageEl).save();
    }

    setActivePageIndex(originalActive);
  };

  const generateImages = async () => {
    const originalActive = activePageIndex;

    for (let i = 0; i < pages.length; i++) {
      setActivePageIndex(i);
      await new Promise((r) => setTimeout(r, 100));
      const pageEl = document.getElementById("visible-page");
      if (!pageEl) continue;

      const canvas = await html2canvas(pageEl, { scale: 2, useCORS: true });
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = makeFileName(i, "png");
          a.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    }

    setActivePageIndex(originalActive);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatDiscordMessage());
    alert("Copied to clipboard!");
  };

  return {
    generatePDF,
    generateImages,
    copyToClipboard,
  };
};
