"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const buttonGroupVariants = {
  variants: {
    default: "inline-flex",
    vertical: "inline-flex flex-col",
  },
  defaultVariants: {
    variant: "default",
  },
}

function ButtonGroup({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "vertical"
}) {
  return (
    <div
      data-slot="button-group"
      className={cn(
        buttonGroupVariants.variants[variant],
        "relative inline-flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800",
        variant === "default"
          ? "items-center"
          : "items-stretch",
        "[&_button]:rounded-none",
        "[&_button]:border-0",
        "[&_button]:shadow-none",
        "[&_button]:relative",
        "[&_button]:z-10",
        "[&_button:hover]:z-20",
        "[&_button:focus-visible]:z-30",
        "[&_button:not(:first-child)]:border-l border-gray-200 dark:border-gray-700",
        "[&_button:first-child]:rounded-l-lg",
        "[&_button:last-child]:rounded-r-lg",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup }