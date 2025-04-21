<!-- Tabs component -->

<script module lang="ts">
	// Import necessary types
	export type SvelteComponent = typeof import('svelte').SvelteComponent;
	export type Writable<T> = import('svelte/store').Writable<T>;
</script>

<script lang="ts">
	// Import Svelte functions and modules
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Interface for a tab
	interface Tab {
		id: string;
		label: string;
		component: SvelteComponent;
		props?: Record<string, any>; // Make props optional
	}

	interface Props {
		tabs?: Tab[];
		header?: string;
	}

	let { tabs = [], header = '' }: Props = $props();

	let activeTab: Writable<string | null> = writable(tabs.length > 0 ? tabs[0].id : null);
	let componentInstances: Record<string, any> = {};

	// Function to set the active tab
	function setActiveTab(tab: string) {
		activeTab.set(tab);
	}

	onMount(() => {
		// Initialize components when the component mounts
		tabs.forEach(({ id, component, props }) => {
			const targetElement = document.getElementById(`tab-content-${id}`);

			if (targetElement) {
				// Initialize component instances with optional props
				componentInstances[id] = new component({
					target: targetElement,
					props: props || {} // Use an empty object if props is not provided
				});
			}
		});
	});
</script>

<div
	class="flex border border-[#263238] dark:border-[#11D9C5] rounded-[3px] mx-auto w-[80%] mt-[10%] h-auto"
>
	{#each tabs as { id, label }}
		<button
			class={`text-[10px] m-1 font-semibold h-full whitespace-nowrap tab ${
				$activeTab === id ? 'active' : ''
			}`}
			onclick={() => setActiveTab(id)}
		>
			{label}
		</button>
	{/each}
</div>
<!-- Displaying the URL without the protocol -->

<h2
	class="pb-2 mx-auto w-[80%] text-center mt-[5%] mb-[3%] text-black flex flex-col items-start dark:text-white text-lg semiBold capitalize leading-[30px]"
>
	{#if $activeTab === 'tab2'}
		<span class="whitespace-nowrap semiBold text-lg"> You're Currently Browsing </span><span
			>{header}</span
		>
	{:else}
		<span class="whitespace-nowrap semiBold text-lg"> User-Driven Insights </span>
	{/if}
</h2>

{#each tabs as { id }}
	<div class="tab-content h-max" class:show={$activeTab === id} id={`tab-content-${id}`}>
		<!-- Content will be mounted here -->
	</div>
{/each}
