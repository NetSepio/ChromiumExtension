<script lang="ts">
	import './styles.css';
	import './wallet';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="w-[351px] shadow-sm h-[600px] bg-white dark:bg-[#171C2F]">
	{@render children?.()}
</div>
