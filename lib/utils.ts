import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskColor(score: number): string {
  if (score >= 90) return "#10b981" // Dark Green
  if (score >= 80) return "#84cc16" // Light Green
  if (score >= 60) return "#eab308" // Yellow
  if (score >= 40) return "#f97316" // Orange
  if (score >= 0) return "#ef4444" // Red
  return "#9ca3af" // Gray (default)
}
