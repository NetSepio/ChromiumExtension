<script context="module" lang="ts">
	export type SvelteComponent = typeof import('svelte').SvelteComponent;
	export type Writable<T> = import('svelte/store').Writable<T>;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { get_current_component } from 'svelte/internal';

	interface Tab {
		id: string;
		label: string;
		component: SvelteComponent;
		props: Record<string, any>;
	}

	export let tabs: Tab[] = [];

	let activeTab: Writable<string | null> = writable(tabs.length > 0 ? tabs[0].id : null);
	let componentInstances: Record<string, any> = {};

	function setActiveTab(tab: string) {
		activeTab.set(tab);
	}

	onMount(() => {
		tabs.forEach(({ id, component, props }) => {
			const targetElement = document.getElementById(`tab-content-${id}`);

			if (targetElement) {
				componentInstances[id] = new component({
					target: targetElement,
					props
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
