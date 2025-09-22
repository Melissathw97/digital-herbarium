import Badge from "@/components/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Log, LogAction, User } from "@/types/user";
import TablePagination from "@/components/pagination";
import { ExternalLink, LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getActivityLogs, getUserProfile } from "@/services/userServices";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Pages } from "@/types/pages";
import { Pagination } from "@/types/plant";
import AuditDescription from "../auditDescription";
import formatDateTime from "@/utils/formatDateTime";

export default function UserActivityLogs() {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const profileIdParam = searchParams.get("profileId");

  const [search, setSearch] = useState("");
  const [action, setAction] = useState("All Actions");

  const [user, setUser] = useState<User>();
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
  });

  const validActions = ["All Actions", "Add", "Update", "Delete", "Import"];

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const getBadgeVariant = (action: LogAction) => {
    switch (action) {
      case LogAction.ADD:
        return "success";

      case LogAction.DELETE:
        return "danger";

      case LogAction.IMPORT:
        return "purple";

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
      dataKey: "plantName",
      render: (log) => <AuditDescription log={log} />,
    },
  ];

  const onPageClick = (page: number) => {
    router.push(`?page=${page.toString()}`);
  };

  const fetchData = async () => {
    try {
      let profileData = null;

      if (pathname.includes("profile")) {
        profileData = await getUserProfile();
        setUser(profileData);
      }

      setIsLoading(true);
      const page = searchParams.get("page");
      const limit = searchParams.get("limit");

      const queryParams = {
        profileId: profileData?.profileId ?? profileIdParam ?? undefined,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      };

      const response = await getActivityLogs(queryParams);

      setLogs(response.data);
      setPagination(response.pagination);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch user activity. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <div className="bg-white shadow-sm rounded-sm px-4 py-5 border flex flex-col gap-5 w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div className="flex gap-y-2 gap-3 items-center flex-wrap">
            <p className="font-semibold">Filters</p>

            {/* Action Filter */}
            <Select value={action} onValueChange={(value) => setAction(value)}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {validActions.map((value) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="rounded-lg [&_span]:flex"
                    >
                      {value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="md:ml-auto flex gap-2">
            <Input
              name="search"
              value={search}
              onChange={onInputChange}
              className="bg-white shadow-sm min-w-[200px]"
              placeholder="Search..."
            />
          </div>
        </div>

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
                <th className="px-3 sticky right-0 z-2 bg-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={headers.length + 2}
                    className="p-3 text-gray-500"
                  >
                    <LoaderCircle className="animate-spin mx-auto" />
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
                    className={`${index % 2 ? "bg-gray-100" : ""}`}
                  >
                    {headers.map(({ dataKey, render }) => (
                      <td
                        key={dataKey}
                        className={`p-4 whitespace-nowrap ${dataKey === "plantName" ? "w-full" : "max-w-[220px]"} overflow-hidden overflow-ellipsis`}
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
                          href={`${Pages.PLANTS}/${log.dataId}`}
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
