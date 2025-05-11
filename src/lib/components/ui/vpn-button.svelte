<script lang="ts">
	import Off from '../icons/off.svelte';
	import On from '../icons/on.svelte';

   let {enabled, toggleConnection} = $props()

</script>

<div class="rounded-full z-30 bg-[#ffffff5e] w-[200px] h-[200px] flex items-center justify-center">
	<div
		class="rounded-full bg-[#ffffff80] size-[75%] flex items-center justify-center relative vpn-loader"
	>
		<button
			class="rounded-full bg-[#ffffff] size-[70%] flex items-center justify-center cursor-pointer"
			onclick={toggleConnection}
		>
			{#if enabled}
				<Off />
			{:else}
				<On />
			{/if}
		</button>
	</div>
</div>

<!-- <div
	class={`relative w-20 h-20 flex items-center justify-center button-container ${enabled ? 'active' : ''}`}
>

	<svg class="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
		<circle
			cx="50"
			cy="50"
			r="45"
			stroke="#4D83EE"
			stroke-width="5"
			fill="transparent"
			class="progress-ring"
		/>
	</svg>


	<button
		id="circleBtn"
		class={`button-container relative bg-blue-500 rounded-full w-16 h-16 focus:outline-none overflow-hidden `}
		onclick={() => {
			enabled = !enabled;
		}}
	>
		<div
			class="dot absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-700 rounded-full opacity-0 transition-opacity"
		></div>
		<span class="text-white font-bold">Go</span>
	</button>
</div> -->

<style>
	/* .vpn-loader::before {
		content: '';
		position: absolute;

		inset: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: conic-gradient(from 0deg, transparent 0deg, #ff2b2b 360deg);
		animation: rotate 1.5s linear infinite;
		z-index: 1;
	} */

	/* .progress-ring {
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		transition: stroke-dashoffset 2s linear;
		transform: rotate(-90deg);
		transform-origin: center;
	}

	.button-container:hover .dot {
		opacity: 1;
	}

	.button-container.active .progress-ring {
		stroke-dashoffset: 0;
	} */
	/* @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  } */
</style>
