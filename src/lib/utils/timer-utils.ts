/**
 * Timer utility functions for formatting and managing time display
 */

/**
 * Formats seconds into HH:MM:SS format
 * @param secs - Number of seconds to format
 * @returns Formatted time string in HH:MM:SS format
 */
export function formatTime(secs: number): string {
	const h = String(Math.floor(secs / 3600)).padStart(2, '0');
	const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
	const s = String(secs % 60).padStart(2, '0');
	return `${h}:${m}:${s}`;
}
