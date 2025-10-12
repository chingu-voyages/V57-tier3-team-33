
import ExportIcon from "./icons/export";

type ExportButtonProps<T = unknown> = {
  data: T[] | undefined;
  filename?: string;
  className?: string;
  disabled?: boolean;
};

const ExportButton = <T,>({
  data,
  filename = "export.json",
  className = "",
  disabled = false,
}: ExportButtonProps<T>) => {
  const isEmpty = !data || data.length === 0;

  const handleExport = () => {
    try {
      const payload = Array.isArray(data) ? data : [];
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={disabled || isEmpty}
      className={`bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200 ${className}`}
    >
      <ExportIcon width={20} fill="#000" />
      <span>Export</span>
    </button>
  );
};

export default ExportButton;