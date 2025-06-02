import { cachedLocations } from '../store/store';
import type { LocationNodeInfo } from '../types/types';

async function fetchFromAPI(): Promise<LocationNodeInfo[]> {
	try {
		const res = await fetch('https://gateway.erebrus.io/api/v1.0/nodes/all');
		const data = await res.json();
		return (data.payload ?? []).filter((node: LocationNodeInfo) => node.status === 'active');
	} catch (error) {
		console.error('API fetch failed:', error);
		throw error;
	}
}

export async function fetchNodes(): Promise<LocationNodeInfo[]> {
	// First try to get from localStorage
	let locations: LocationNodeInfo[] = [];

	try {
		const cached = localStorage.getItem('cachedLocations');
		if (cached) {
			locations = JSON.parse(cached);
			// Update store with cached data
			cachedLocations.set(locations);
		}
	} catch (error) {
		console.error('Error reading from cache:', error);
	}

	// If we have cached locations, return them immediately
	if (locations.length > 0) {
		// Try to update cache in background
		updateLocationsCache().catch(console.error);
		return locations;
	}

	// If no cache, fetch from API
	try {
		const freshLocations = await fetchFromAPI();
		// Update cache and store
		cachedLocations.set(freshLocations);
		return freshLocations;
	} catch (error) {
		console.error('Failed to fetch locations:', error);
		return locations; // Return empty array if both cache and API fail
	}
}

// Function to update cache in background
export async function updateLocationsCache(): Promise<void> {
	try {
		const freshLocations = await fetchFromAPI();
		const cached = localStorage.getItem('cachedLocations');

		if (cached) {
			const currentLocations = JSON.parse(cached);
			// Compare and update only if there are changes
			if (JSON.stringify(currentLocations) !== JSON.stringify(freshLocations)) {
				cachedLocations.set(freshLocations);
			}
		} else {
			cachedLocations.set(freshLocations);
		}
	} catch (error) {
		console.error('Background sync failed:', error);
	}
}
