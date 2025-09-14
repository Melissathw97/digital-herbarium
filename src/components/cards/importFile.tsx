import { DownloadIcon, FileSpreadsheetIcon, FileTextIcon } from "lucide-react";

interface Template {
  name: string;
  download_url: string;
  type: string;
  description: string;
}

export default function ImportFileCard({ file }: { file: Template }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center h-full gap-3 p-4 bg-gray-50 border rounded-lg">
      <div className="p-2 bg-lime-700/10 text-lime-700 rounded-full">
        {file.type === "pdf" ? (
          <FileTextIcon className="w-5 h-5" />
        ) : (
          <FileSpreadsheetIcon className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <p className="font-medium break-all">{file.name}</p>
        <p className="text-xs text-gray-500">{file.description}</p>
      </div>

      <div className="flex gap-1 text-xs text-lime-700/60 font-semibold mt-2 md:mt-0">
        <span className="md:hidden">Click to Download</span>
        <DownloadIcon className="w-4.5 h-4.5" />
      </div>
    </div>
  );
}
