import { Export } from "./icons";

interface ExportButtonProps {
  data: unknown;
  filename: string;
}

export default function ExportButton({
  data,
  filename,
}: ExportButtonProps) {
  const handleExport = (): void => {
    try {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      alert("An error occurred during export.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
    >
      <Export width={20} fill="#000" />
      <span>Export JSON</span>
    </button>
  );
}