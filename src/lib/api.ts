import type { LocationNodeInfo } from '../types/types';

export async function fetchNodes() {
	const res = await fetch('https://gateway.erebrus.io/api/v1.0/nodes/all');
	const data = await res.json();
	return (
		(data.payload ?? [])
			// .filter((node: LocationNodeInfo) => node.region === 'IN')
			.filter((node: LocationNodeInfo) => node.status === 'active')
	);
}
