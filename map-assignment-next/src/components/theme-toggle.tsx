"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="default"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
              relative overflow-hidden transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-lg active:scale-95
              border-2 hover:border-primary/50
              ${theme === "dark" 
                ? "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800" 
                : "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
              }
              group min-w-[120px] h-10
            `}
          >
            <div className="flex items-center gap-2 relative z-10">
              <div className="relative">
                <Sun className={`
                  h-4 w-4 transition-all duration-500 ease-in-out
                  ${theme === "dark" 
                    ? "rotate-90 scale-0 opacity-0" 
                    : "rotate-0 scale-100 opacity-100"
                  }
                  ${isHovered ? "animate-pulse" : ""}
                `} />
                <Moon className={`
                  absolute top-0 left-0 h-4 w-4 transition-all duration-500 ease-in-out
                  ${theme === "dark" 
                    ? "rotate-0 scale-100 opacity-100" 
                    : "-rotate-90 scale-0 opacity-0"
                  }
                  ${isHovered ? "animate-pulse" : ""}
                `} />
              </div>
              
              <span className={`
                text-sm font-medium transition-all duration-300
                ${theme === "dark" ? "text-slate-200" : "text-slate-700"}
                group-hover:text-primary
              `}>
                {theme === "dark" ? "Dark" : "Light"}
              </span>
              
              <Palette className={`
                h-3 w-3 transition-all duration-300
                ${isHovered ? "rotate-12 scale-110" : "rotate-0 scale-100"}
                ${theme === "dark" ? "text-slate-400" : "text-slate-500"}
                group-hover:text-primary
              `} />
            </div>
            
            {/* Animated background effect */}
            <div className={`
              absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300
              ${theme === "dark" 
                ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                : "bg-gradient-to-r from-yellow-400 to-orange-400"
              }
            `} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="font-medium">
          <p>Switch to {theme === "light" ? "dark" : "light"} mode</p>
          <p className="text-xs text-muted-foreground">Click to toggle theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}