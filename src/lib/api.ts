import type { LocationNodeInfo } from '../../types/types';

const location = [
	'rising_usurper',
	'universal_roar',
	'shadow_serpent',
	'solis',
	'american_eagle',
	'testing-x-ray'
];

export async function fetchNodes() {
	const res = await fetch('https://gateway.erebrus.io/api/v1.0/nodes/all');
	const data = await res.json();
	return (data.payload ?? []).filter((node: LocationNodeInfo) => location.includes(node.name));
}
