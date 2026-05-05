"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function ComparisonTable({
  headers,
  rows,
  stickyFirstColumn,
}: {
  headers: string[];
  rows: string[][];
  stickyFirstColumn?: boolean;
}) {
  return (
    <div
      className={cn(
        "my-6 max-w-full overflow-x-auto rounded-md border border-border",
        stickyFirstColumn && "relative",
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-card hover:bg-card">
            {headers.map((h, j) => (
              <TableHead
                key={j}
                className={cn(
                  "border-b border-border font-bold text-foreground",
                  stickyFirstColumn &&
                    j === 0 &&
                    "sticky left-0 z-10 bg-card",
                )}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, ri) => (
            <TableRow
              key={ri}
              className={cn(
                ri % 2 === 1 ? "bg-muted/40" : "bg-muted/20",
                "border-border hover:bg-muted/60",
              )}
            >
              {row.map((cell, ci) => (
                <TableCell
                  key={ci}
                  className={cn(
                    "border-border text-muted-foreground",
                    stickyFirstColumn &&
                      ci === 0 &&
                      "sticky left-0 z-10 bg-inherit font-medium text-foreground",
                  )}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
