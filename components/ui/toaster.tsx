"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "bg-background border border-border text-foreground p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300",
            "animate-in slide-in-from-right-full",
            toast.open === false && "animate-out slide-out-to-right-full",
            toast.variant === "default" && "border-border",
            toast.variant === "destructive" && "border-destructive/50 text-destructive-foreground bg-destructive",
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-medium text-sm">{toast.title}</div>
              {toast.description && (
                <div className="text-xs text-muted-foreground mt-1">
                  {toast.description}
                </div>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-2 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 flex-shrink-0"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
