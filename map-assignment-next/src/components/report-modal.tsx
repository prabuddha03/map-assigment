import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  factoryId?: number | null;
  factoryName?: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  factoryId,
  factoryName = `Factory ${factoryId}`,
}: ReportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Report for {factoryName}</DialogTitle>
          <DialogDescription>
            Select the parameters for the report you want to generate.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Report generation options will go here.</p>
        </div>
        <Button onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}