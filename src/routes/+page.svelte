<script>
	import Dashboard from '$lib/components/Dashboard.svelte';
	import Header from '$lib/components/Header.svelte';
	import { onboardingStepsLeft } from '$lib/store/store';
</script>

{#if $onboardingStepsLeft === 4}
	<div class="artboard phone-1">
		<Header />
		<img src="./logo.png" alt="NetSepio logo" />
		<div class="">
			<h1 class="text-5xl text-left">Welcome <br /> to Netsepio</h1>
			<div class="mt-2">
				<a href="/">
					<button
						class="btn btn-wide mt-3"
						on:click={() => {
							onboardingStepsLeft.set(3);
						}}>Dashboard</button
					>
				</a>
			</div>
		</div>
	</div>
{:else}
	<Dashboard />
{/if}
