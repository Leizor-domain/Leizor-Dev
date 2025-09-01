import { formatDistanceToNow, parseISO } from 'date-fns';

export function formatTimeAgo(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown time';
  }
}

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Unknown date';
  }
}

export function isRecent(dateString: string, hours: number = 24): boolean {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffInHours <= hours;
  } catch {
    return false;
  }
}
