"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function AlertTable() {
  const alerts = useSelector((state: RootState) => state.alerts.alerts);
  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Severity</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.slice(0, 4).map((alert) => (
            <TableRow key={alert.id} className="hover:bg-muted/50">
              <TableCell className="py-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      alert.severity === "High"
                        ? "destructive"
                        : alert.severity === "Medium"
                        ? "secondary"
                        : "default"
                    }
                    className="text-xs"
                  >
                    {alert.severity}
                  </Badge>
                  {alert.isNew && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </div>
              </TableCell>
              <TableCell className="py-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <div className="text-xs leading-tight">
                        {alert.description.length > 32
                          ? `${alert.description.substring(0, 32)}...`
                          : alert.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <div className="space-y-1">
                      <p className="font-medium">{alert.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                      <p className="text-xs">
                        <span className="font-medium">Severity:</span> {alert.severity}
                      </p>
                      {alert.isNew && (
                        <p className="text-xs text-blue-500 font-medium">• New Alert</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}