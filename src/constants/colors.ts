export const BrandColors = {
  primary: '#0a7ea4',
  primaryDark: '#075c79',
  emergency: '#d92d20',
  emergencyDark: '#a51d11',
  success: '#16a34a',
  warning: '#f59e0b',
  info: '#2563eb',
  neutral50: '#f9fafb',
  neutral100: '#f3f4f6',
  neutral500: '#6b7280',
  neutral900: '#111827',
} as const;

export type BrandColor = keyof typeof BrandColors;
