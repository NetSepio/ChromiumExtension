<!-- Tabs component -->

<script context="module" lang="ts">
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

	export let tabs: Tab[] = [];

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

<div class="p-1 flex border border-[#263238] dark:border-[#11D9C5] rounded-md mb-6 mx-auto w-11/12">
	{#each tabs as { id, label }}
		<button class={`tab ${$activeTab === id ? 'active' : ''}`} on:click={() => setActiveTab(id)}>
			{label}
		</button>
	{/each}
</div>

{#each tabs as { id }}
	<div class="tab-content" class:show={$activeTab === id} id={`tab-content-${id}`}>
		<!-- Content will be mounted here -->
	</div>
{/each}
