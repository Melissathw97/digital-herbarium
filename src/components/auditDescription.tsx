import { Fragment } from "react";
import { Log, LogAction } from "@/types/user";

export default function AuditDescription({ log }: { log: Log }) {
  switch (log.action) {
    case LogAction.ADD:
      return (
        <p>
          Added <b>{log.plantName}</b>
        </p>
      );

    case LogAction.UPDATE:
      return (
        <div>
          {log.updateType} <b>{log.plantName}</b>
          {(log.changes || []).length > 0 && (
            <Fragment key={log.id}>
              <br />
              <p className="mt-1">
                {log.changes?.map(({ field, from, to }) => (
                  <Fragment key={`${log.dataId}-${field}`}>
                    {field}: {from} &rarr; {to}
                    <br />
                  </Fragment>
                ))}
              </p>
            </Fragment>
          )}
        </div>
      );

    case LogAction.DELETE:
      return (
        <p>
          Deleted <b>{log.plantName}</b>
        </p>
      );

    case LogAction.IMPORT:
      return (
        <p>
          Imported <b>{log.plantName}</b>
        </p>
      );
  }
}
