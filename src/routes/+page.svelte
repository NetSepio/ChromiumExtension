<script>
	import Dashboard from '$lib/components/Dashboard.svelte';
	import Header from '$lib/components/Header.svelte';
	import { onboardingStepsLeft } from '$lib/store/store';
</script>

{#if $onboardingStepsLeft === 4}
	<div>
		<Header />
		<div class="flex flex-col justify-evenly items-center w-[360px] min-h-[490px] max-h-max">
			<img src="./Vector-logo.png" alt="NetSepio logo" width="50%" />
			<div class="">
				<h1 class="text-4xl text-left">Welcome <br /> to Netsepio</h1>
				<div class="mt-2">
					<a href="/">
						<button
							class="btn btn-wide mt-3"
							on:click={() => {
								onboardingStepsLeft.set(3);
							}}
						>
							Dashboard
						</button>
					</a>
				</div>
			</div>
		</div>
	</div>
{:else}
	<Dashboard />
{/if}
