<script>
	import Dashboard from '$lib/components/Dashboard.svelte';
	import Header from '$lib/components/Header.svelte';
	import { onboardingStepsLeft } from '$lib/store/store';

let src = "./logo-3.png"
</script>


{#if $onboardingStepsLeft === 4}
	<div>
		<Header />
		<div class="flex flex-col justify-evenly items-center w-[360px] min-h-[490px] max-h-max">
			<img {src} alt="NetSepio logo" class="w-1/2" />
			<div class="">
				<h1 class="text-3xl text-left">Welcome <br /> to Netsepio</h1>
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
