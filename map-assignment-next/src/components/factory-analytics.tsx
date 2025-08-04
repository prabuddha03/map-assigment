import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface FactoryAnalyticsProps {
  factoryId: number;
  onBack: () => void;
}

export default function FactoryAnalytics({
  factoryId,
  onBack,
}: FactoryAnalyticsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Factory {factoryId} Analytics</CardTitle>
            <CardDescription>
              Detailed analytics for the selected factory.
            </CardDescription>
          </div>
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>Analytics for factory {factoryId} will be displayed here.</p>
      </CardContent>
    </Card>
  );
}