/**
 * Type definitions for the Civic Diary Admin Dashboard
 */

/**
 * Data item type for the data management page
 */
export interface DataItem {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "active" | "inactive";
}

/**
 * General settings type for the settings page
 */
export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  itemsPerPage: number;
  darkMode: boolean;
}

/**
 * Database settings type for the settings page
 */
export interface DatabaseSettings {
  tableName: string;
  backupEnabled: boolean;
  backupFrequency: "hourly" | "daily" | "weekly" | "monthly";
  autoCleanup: boolean;
  retentionDays: number;
}

/**
 * News item type for the news management page
 */
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  publishedDate: string;
  link: string;
  is_published?: boolean;
}

/**
 * Dashboard statistic item type
 */
export interface StatisticItem {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}
