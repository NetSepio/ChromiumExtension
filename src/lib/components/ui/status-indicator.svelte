<script lang="ts">
	let {status} : { status: string} = $props()
	import { fade } from 'svelte/transition';
</script>

<h1 class="text-white text-center  font-bold text-xl" transition:fade={{ duration: 200}}>
	{status}
</h1>
