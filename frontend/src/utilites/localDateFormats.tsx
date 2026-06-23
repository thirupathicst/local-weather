import { useMemo } from 'react';

type FormatType = 'date' | 'time' | 'both';

function useFormattedDate(timestamp: any, format: FormatType = 'both') {
  return useMemo(() => {
    if (!timestamp) return '';
    const date = new Date(timestamp);

    if (format === 'date') {
      return date.toLocaleDateString('en-IN', {
        timeZone: 'UTC',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }

    if (format === 'time') {
      return date.toLocaleTimeString('en-IN', {
        timeZone: 'UTC',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }

    // format === 'both'
    return date.toLocaleDateString('en-IN', {
      timeZone: 'UTC',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }, [timestamp, format]);
}

function getDate() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
  
  

export default { useFormattedDate, getDate };

// Usage inside a component:
// const friendlyDate = useFormattedDate("2026-06-22T06:30:00.000Z"); // date + time
// const dateOnly = useFormattedDate("2026-06-22T06:30:00.000Z", 'date'); // date only
// const timeOnly = useFormattedDate("2026-06-22T06:30:00.000Z", 'time'); // time only