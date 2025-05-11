<script lang="ts">
	let { signal } = $props();

	const getColor = (index: number) => {
		if (signal === 'active') {
			return '#22AD5C';
		}
		if (signal === 'medium') {
			if (index < 2) return '#FFC700';
			return '#DBD6CE';
		}
		if (signal === 'inactive') {
			if (index === 0) return '#E74C3C';
			return '#DBD6CE';
		}
		return '#DBD6CE';
	};
</script>

<svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<rect x="0.699219" y="12" width="5.16129" height="12" rx="0.688172" fill={getColor(0)} />
	<rect x="8.26953" y="6" width="5.16129" height="18" rx="0.688172" fill={getColor(1)} />
	<rect x="15.8389" width="5.16129" height="24" rx="0.688172" fill={getColor(2)} />
</svg>
