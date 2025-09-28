import { Fragment } from "react";
import Badge from "./badge";
import { Status } from "@/types/plant";
import UserRoleBadge from "./users/userRoleBadge";
import { Log, LogAction, UserRole } from "@/types/user";

export default function AuditDescription({ log }: { log: Log }) {
  const getBadgeVariant = (text: Status) => {
    switch (text) {
      case Status.APPROVED:
        return "success";
      case Status.PENDING_APPROVAL:
        return "warning";
      case Status.REJECTED:
        return "danger";
      default:
        return "default";
    }
  };

  switch (log.action) {
    case LogAction.ADD:
      return (
        <p>
          Added <b>{log.name}</b>
        </p>
      );

    case LogAction.UPDATE:
      return (
        <div>
          {log.updateType} <b>{log.name}</b>
          {(log.changes || []).length > 0 && (
            <Fragment key={log.id}>
              <br />
              <div className="mt-2 flex flex-col gap-1 text-[10px]">
                {log.changes?.map(({ field, from, to }) => {
                  const fieldName = field.replace("_", " ");

                  if (field === "role") {
                    return (
                      <div
                        key={`${log.dataId}-${field}`}
                        className="flex items-center gap-0.5"
                      >
                        <span className="capitalize font-semibold text-gray-500">
                          {fieldName}:
                        </span>
                        <UserRoleBadge user={{ role: from as UserRole }} />{" "}
                        &rarr; <UserRoleBadge user={{ role: to as UserRole }} />
                        <br />
                      </div>
                    );
                  }

                  if (field === "status") {
                    return (
                      <div key={`${log.dataId}-${field}`}>
                        <span className="capitalize font-semibold text-gray-500">
                          {fieldName}
                        </span>
                        : &nbsp;
                        <Badge
                          variant={getBadgeVariant(from as Status)}
                          bordered
                        >
                          {from || "-"}
                        </Badge>{" "}
                        &rarr;{" "}
                        <Badge variant={getBadgeVariant(to as Status)} bordered>
                          {to || "-"}
                        </Badge>
                        <br />
                      </div>
                    );
                  }

                  if (field === "image_path") {
                    return (
                      <p
                        key={`${log.dataId}-${field}`}
                        className="overflow-hidden overflow-ellipsis"
                      >
                        <span className="capitalize font-semibold text-gray-500">
                          {fieldName}
                        </span>
                        : &nbsp;
                        {from ? (
                          <span>{from.match(/\/[^\s\/]+$/)?.[0]} &rarr; </span>
                        ) : null}
                        {to.match(/\/[^\s\/]+$/)?.[0]}
                        <br />
                      </p>
                    );
                  }

                  return (
                    <p
                      key={`${log.dataId}-${field}`}
                      className="overflow-hidden overflow-ellipsis"
                    >
                      <span className="capitalize font-semibold text-gray-500">
                        {fieldName}
                      </span>
                      : &nbsp;
                      {from ? <span>{from} &rarr; </span> : null}
                      {to || <span className="text-gray-400 italic">null</span>}
                      <br />
                    </p>
                  );
                })}
              </div>
            </Fragment>
          )}
        </div>
      );

    case LogAction.DELETE:
      return (
        <p>
          Deleted <b>{log.name}</b>
        </p>
      );

    case LogAction.IMPORT:
      return (
        <p>
          Imported <b>{log.name}</b>
        </p>
      );

    case LogAction.EXPORT:
      return (
        <p>
          Exported <b>{log.name}</b>
        </p>
      );
  }
}
