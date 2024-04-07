<script lang="ts">
	import { darktheme } from '$lib/store/store';

	let darkMode: boolean | undefined = undefined; // Initial dark mode state
	darktheme.subscribe((data) => (darkMode = data));

	$: fillColor = darkMode ? '#11D9C5' : '#263238';
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none">
	<path
		d="M3.80827 5.51953L0.510449 1.56215C0.0762306 1.04109 0.446755 0.25 1.12503 0.25L6.87562 0.25C7.5539 0.25 7.92442 1.04109 7.4902 1.56215L4.19238 5.51953C4.09243 5.63947 3.90822 5.63947 3.80827 5.51953Z"
		fill={fillColor}
	/>
</svg>
