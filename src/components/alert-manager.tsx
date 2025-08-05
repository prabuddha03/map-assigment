"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addAlert } from "@/store/slices/alertSlice";
import { AlertTriangle, Zap, Info } from "lucide-react";

const alertTemplates = [
  {
    severity: "High" as const,
    descriptions: [
      "Machine 4B temperature critical - exceeding 90°C threshold",
      "Power grid failure detected in Zone C - backup systems activated",
      "Hydraulic system pressure drop below safety limits",
      "Emergency shutdown triggered in Assembly Line 2",
      "Critical sensor malfunction in Quality Control station",
      "Fire suppression system activated in Warehouse B",
    ]
  },
  {
    severity: "Medium" as const,
    descriptions: [
      "Network latency spike detected across monitoring systems",
      "Unusual vibration patterns in Motor Unit 7A",
      "Temperature fluctuation in Cold Storage Unit 3",
      "Maintenance window approaching for Conveyor System 5",
      "Inventory levels approaching reorder threshold",
      "Air quality sensors reporting elevated particulate levels",
    ]
  },
  {
    severity: "Low" as const,
    descriptions: [
      "Routine system health check completed successfully",
      "Minor calibration drift detected in Scale Unit 12",
      "Lighting system scheduled for maintenance next week",
      "WiFi connectivity intermittent in Break Room Area",
      "Parking sensor battery level at 15% in Bay 7",
      "Software update available for Dashboard System",
    ]
  }
];

export default function AlertManager() {
  const dispatch = useDispatch();

  useEffect(() => {
    const generateRandomAlert = () => {
      const severityTypes = ["High", "Medium", "Low"] as const;
      const randomSeverity = severityTypes[Math.floor(Math.random() * severityTypes.length)];
      const templates = alertTemplates.find(t => t.severity === randomSeverity);
      const randomDescription = templates!.descriptions[Math.floor(Math.random() * templates!.descriptions.length)];

      const newAlert = {
        severity: randomSeverity,
        description: randomDescription,
      };

      // Add to Redux store
      dispatch(addAlert(newAlert));

      // Show toast notification
      const IconComponent = randomSeverity === "High" ? AlertTriangle : randomSeverity === "Medium" ? Zap : Info;
      
      toast(randomDescription, {
        description: `${randomSeverity} severity alert`,
        icon: <IconComponent className="h-4 w-4" />,
        position: "bottom-right",
        duration: randomSeverity === "High" ? 8000 : randomSeverity === "Medium" ? 6000 : 4000,
        style: {
          backgroundColor: randomSeverity === "High" 
            ? "hsl(var(--destructive))" 
            : randomSeverity === "Medium" 
            ? "hsl(var(--secondary))" 
            : "hsl(var(--muted))",
          color: randomSeverity === "High" 
            ? "hsl(var(--destructive-foreground))" 
            : randomSeverity === "Medium" 
            ? "hsl(var(--secondary-foreground))" 
            : "hsl(var(--muted-foreground))",
          border: "1px solid hsl(var(--border))",
        },
        className: "font-sans",
      });
    };

    // Generate initial alert after 3 seconds
    const initialTimeout = setTimeout(generateRandomAlert, 3000);

    // Then generate alerts at random intervals (15-45 seconds)
    const generateAlerts = () => {
      const randomInterval = Math.random() * 30000 + 15000; // 15-45 seconds
      setTimeout(() => {
        generateRandomAlert();
        generateAlerts(); // Schedule next alert
      }, randomInterval);
    };

    generateAlerts();

    return () => {
      clearTimeout(initialTimeout);
    };
  }, [dispatch]);

  return null; // This component doesn't render anything
}