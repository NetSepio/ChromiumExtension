<script lang="ts">
	let { status }: { status: string } = $props();
	import { fade } from 'svelte/transition';
</script>

<h1 class="text-center text-xl font-bold text-white" transition:fade={{ duration: 200 }}>
	{status}
</h1>
