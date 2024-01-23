<!-- Create review success page -->
<script>
	// Importing Header component
	import Header from '$lib/components/Header.svelte';
</script>

<!-- Main content for the success page -->
<div>
	<!-- Header component for consistent styling -->
	<Header />

	<!-- Container for success message and button -->
	<div class="h-[460px] text-center flex flex-col items-center justify-center gap-4">
		<!-- Success illustration with a circle and path -->
		<svg
			width="180"
			height="180"
			viewBox="0 0 180 180"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="75" cy="105" r="52.5" fill="#222944" />
			<path
				d="M44.9998 97.502L74.2205 119.417C74.6542 119.743 75.268 119.663 75.6045 119.238L126.9 54.4531"
				stroke="#11D9C5"
				stroke-width="7"
				stroke-linecap="round"
			/>
		</svg>

		<!-- Success message -->
		<h1 class="text-black dark:text-white text-xl text-center font-bold">
			Successfully submitted!
		</h1>

		<!-- Button to navigate to the homepage -->
		<a href="/" class="w-full">
			<button class="btn primary-button">go to homepage</button>
		</a>
	</div>
</div>
