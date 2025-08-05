"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MobileMapControlsProps {
  onOpenSidebar: () => void;
}

const MobileMapControls: React.FC<MobileMapControlsProps> = ({ onOpenSidebar }) => {
  return (
    <div className="md:hidden absolute top-4 right-4 z-[1000]">
      <Button
        onClick={onOpenSidebar}
        className="bg-white border border-gray-300 shadow-lg hover:bg-gray-50 text-black"
        size="sm"
      >
        <Menu className="h-4 w-4 mr-2" />
        <span className="text-xs font-medium">Map Controls & Tools</span>
      </Button>
    </div>
  );
};

export default MobileMapControls;