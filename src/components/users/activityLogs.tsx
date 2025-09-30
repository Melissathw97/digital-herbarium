import { useEffect, useState } from "react";
import Badge from "@/components/badge";
import { ExternalLink } from "lucide-react";
import { Log, LogAction } from "@/types/user";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "../spinner";
import { Pages } from "@/types/pages";
import SearchField from "../searchField";
import { Pagination } from "@/types/plant";
import AuditDescription from "../auditDescription";
import formatDateTime from "@/utils/formatDateTime";

export default function ActivityLogs({
  type = "plants",
  fetchLogs,
  logs = [],
  isLoading,
  pagination,
  link,
}: {
  type?: string;
  fetchLogs: () => void;
  logs: Log[];
  isLoading: boolean;
  pagination: Pagination;
  link?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [action, setAction] = useState("all");

  const validActions = [
    { label: "All Actions", value: "all" },
    { label: "Add", value: "add" },
    { label: "Update", value: "update" },
    { label: "Delete", value: "delete" },
    ...(type === "plants"
      ? [
          { label: "Import", value: "import" },
          { label: "Export", value: "export" },
        ]
      : []),
  ];

  const onActionSelect = (value: string) => {
    setAction(value);

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("action", value);

    router.push(`?${currentParams.toString()}`);
  };

  const getBadgeVariant = (action: LogAction) => {
    switch (action) {
      case LogAction.ADD:
        return "success";

      case LogAction.DELETE:
        return "danger";

      case LogAction.IMPORT:
        return "purple";

      case LogAction.EXPORT:
        return "indigo";

      case LogAction.UPDATE:
      default:
        return "default";
    }
  };

  const headers: {
    label: string;
    dataKey: keyof Log;
    render?: (log: Log) => React.ReactNode;
  }[] = [
    {
      label: "Date/Time",
      dataKey: "actionDate",
      render: (log) => formatDateTime(log.actionDate),
    },
    {
      label: "Action",
      dataKey: "action",
      render: (log) => (
        <Badge variant={getBadgeVariant(log.action)} bordered>
          {log.action.toUpperCase()}
        </Badge>
      ),
    },
    {
      label: "Description",
      dataKey: "name",
      render: (log) => <AuditDescription log={log} />,
    },
    ...(pathname.startsWith(Pages.AUDIT_LOGS)
      ? [
          {
            label: "Action By",
            dataKey: "actionBy" as keyof Log,
          },
        ]
      : []),
  ];

  const onPageClick = (page: number) => {
    router.push(`?page=${page.toString()}`);
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const action = searchParams.get("action") || "";
    setAction(action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col gap-5 w-full overflow-hidden">
        {isLoading ? null : (
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="flex gap-y-2 gap-3 items-center flex-wrap">
              <p className="font-semibold">Filters</p>

              {/* Action Filter */}
              <Select value={action} onValueChange={onActionSelect}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {validActions.map(({ label, value }) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="rounded-lg [&_span]:flex"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="md:ml-auto flex gap-2">
              <SearchField />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-md border overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                {headers.map(({ label }) => (
                  <th key={label} className="p-3 whitespace-nowrap">
                    {label}
                  </th>
                ))}
                <th className="px-3 sticky right-0 z-2 bg-white"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={headers.length + 2}
                    className="p-3 text-gray-500"
                  >
                    <Spinner />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length + 2}
                    className="p-3 text-center text-gray-500"
                  >
                    No data found.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={`${index % 2 ? "bg-gray-100 border-y" : ""}`}
                  >
                    {headers.map(({ dataKey, render }) => (
                      <td
                        key={dataKey}
                        className={`p-4 whitespace-nowrap ${dataKey === "name" ? "w-full max-w-[350px]" : "max-w-[220px]"} overflow-hidden overflow-ellipsis`}
                      >
                        {render
                          ? render(log)
                          : ((log[
                              dataKey as keyof Log
                            ] as unknown as React.ReactNode) ?? "-")}
                      </td>
                    ))}
                    <td
                      className={`p-3 sticky right-0 z-2 ${index % 2 ? "bg-gray-100/90" : "bg-white/90"}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {log.dataId && (
                        <a
                          href={`${link || Pages.PLANTS}/${log.dataId}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <Button
                            size="xs"
                            variant="outline"
                            title="View Plant Details"
                          >
                            <ExternalLink />
                          </Button>
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination pagination={pagination} onPageClick={onPageClick} />
      </div>
    </>
  );
}
