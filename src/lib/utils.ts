import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends unknown[], R>(
  func: (...args: T) => R,
  wait: number
): (...args: T) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: T) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDuration(startDate: Date, endDate: Date): string {
  const diffInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return `${Math.round(diffInHours)} hours`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days`;
}
